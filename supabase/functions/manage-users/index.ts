import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Verify caller is admin
  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");
  const { data: { user: caller } } = await supabaseAdmin.auth.getUser(token);
  if (!caller) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  const { data: roleData } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", caller.id).single();
  if (roleData?.role !== "admin") return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

  const { action, ...body } = await req.json();

  if (action === "create") {
    const { email, password, name, role } = body;
    const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { name },
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
    await supabaseAdmin.from("user_roles").insert({ user_id: newUser.user!.id, role });
    return new Response(JSON.stringify({ user: newUser.user }), { headers: corsHeaders });
  }

  if (action === "update") {
    const { userId, name, email } = body;
    if (email) {
      await supabaseAdmin.auth.admin.updateUserById(userId, { email });
    }
    if (name) {
      await supabaseAdmin.from("profiles").update({ name }).eq("user_id", userId);
    }
    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  }

  if (action === "delete") {
    const { userId } = body;
    await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
    await supabaseAdmin.from("profiles").delete().eq("user_id", userId);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  }

  if (action === "list") {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const { data: profiles } = await supabaseAdmin.from("profiles").select("user_id, name");
    const roleMap = Object.fromEntries((roles || []).map(r => [r.user_id, r.role]));
    const nameMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p.name]));
    const result = users.map(u => ({
      id: u.id,
      email: u.email || "",
      name: nameMap[u.id] || u.email || "",
      role: roleMap[u.id] || "unknown",
      created_at: u.created_at,
    }));
    return new Response(JSON.stringify({ users: result }), { headers: corsHeaders });
  }

  return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: corsHeaders });
});
