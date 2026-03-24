import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create demo users
    const demoUsers = [
      { email: "admin@cleancollect.ng", password: "admin123", name: "Adebayo Okafor", role: "admin" },
      { email: "ops@greenbin.ng", password: "company123", name: "Chioma Eze", role: "company" },
      { email: "ops@wasteaway.ng", password: "company123", name: "Tunde Balogun", role: "company" },
      { email: "amina@gmail.com", password: "household123", name: "Amina Yusuf", role: "household" },
      { email: "emeka@gmail.com", password: "household123", name: "Emeka Nwosu", role: "household" },
    ];

    const userIds: Record<string, string> = {};

    for (const u of demoUsers) {
      // Check if user exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((eu) => eu.email === u.email);

      if (existing) {
        userIds[u.email] = existing.id;
        // Ensure profile exists
        await supabaseAdmin.from("profiles").upsert({ user_id: existing.id, name: u.name }, { onConflict: "user_id" });
      } else {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: { name: u.name },
        });
        if (error) throw new Error(`Failed to create user ${u.email}: ${error.message}`);
        userIds[u.email] = data.user.id;
      }

      // Assign role
      await supabaseAdmin.from("user_roles").upsert(
        { user_id: userIds[u.email], role: u.role },
        { onConflict: "user_id,role" }
      );
    }

    // Service areas
    const serviceAreasData = [
      { name: "Ikeja", lga: "Ikeja", state: "Lagos" },
      { name: "Lekki", lga: "Eti-Osa", state: "Lagos" },
      { name: "Wuse", lga: "Wuse", state: "Abuja FCT" },
      { name: "Garki", lga: "Garki", state: "Abuja FCT" },
      { name: "Port Harcourt", lga: "Port Harcourt", state: "Rivers" },
    ];

    // Delete existing seed data
    await supabaseAdmin.from("pickup_requests").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("issue_reports").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("approval_requests").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("company_service_areas").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("waste_companies").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("household_profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("service_areas").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const { data: saData, error: saError } = await supabaseAdmin.from("service_areas").insert(serviceAreasData).select();
    if (saError) throw saError;
    const saIds = saData.map((sa: any) => sa.id);

    // Companies
    const companiesData = [
      { user_id: userIds["ops@greenbin.ng"], name: "GreenBin Ltd", registration_number: "RC-100234", phone: "08012345678", email: "ops@greenbin.ng", address: "12 Allen Ave, Ikeja, Lagos", status: "approved" },
      { user_id: userIds["ops@wasteaway.ng"], name: "WasteAway Inc", registration_number: "RC-200567", phone: "08098765432", email: "ops@wasteaway.ng", address: "5 Aminu Kano Cr, Wuse, Abuja", status: "approved" },
    ];

    const { data: compData, error: compError } = await supabaseAdmin.from("waste_companies").insert(companiesData).select();
    if (compError) throw compError;

    // Company service area mappings
    await supabaseAdmin.from("company_service_areas").insert([
      { company_id: compData[0].id, service_area_id: saIds[0] },
      { company_id: compData[0].id, service_area_id: saIds[1] },
      { company_id: compData[1].id, service_area_id: saIds[2] },
      { company_id: compData[1].id, service_area_id: saIds[3] },
    ]);

    // Household profiles
    const householdsData = [
      { user_id: userIds["amina@gmail.com"], address: "45 Opebi Rd, Ikeja, Lagos", lga: "Ikeja", state: "Lagos", phone: "08033344455" },
      { user_id: userIds["emeka@gmail.com"], address: "8 Admiralty Way, Lekki, Lagos", lga: "Eti-Osa", state: "Lagos", phone: "08077788899" },
    ];

    const { data: hhData, error: hhError } = await supabaseAdmin.from("household_profiles").insert(householdsData).select();
    if (hhError) throw hhError;

    // Pickup requests
    await supabaseAdmin.from("pickup_requests").insert([
      { household_id: hhData[0].id, household_name: "Amina Yusuf", address: "45 Opebi Rd, Ikeja", service_area_id: saIds[0], company_id: compData[0].id, company_name: "GreenBin Ltd", waste_type: "General Waste", description: "Weekly household waste pickup", scheduled_date: "2026-03-25", status: "Assigned" },
      { household_id: hhData[1].id, household_name: "Emeka Nwosu", address: "8 Admiralty Way, Lekki", service_area_id: saIds[1], company_id: compData[0].id, company_name: "GreenBin Ltd", waste_type: "Recyclables", description: "Plastics and paper for recycling", scheduled_date: "2026-03-26", status: "Pending" },
      { household_id: hhData[0].id, household_name: "Amina Yusuf", address: "45 Opebi Rd, Ikeja", service_area_id: saIds[0], company_id: compData[0].id, company_name: "GreenBin Ltd", waste_type: "Organic Waste", description: "Garden and food waste", scheduled_date: "2026-03-18", status: "Completed" },
      { household_id: hhData[1].id, household_name: "Emeka Nwosu", address: "8 Admiralty Way, Lekki", service_area_id: saIds[1], waste_type: "Bulky Items", description: "Old furniture removal", scheduled_date: "2026-03-28", status: "Pending" },
    ]);

    // Issue reports
    await supabaseAdmin.from("issue_reports").insert([
      { household_id: hhData[0].id, household_name: "Amina Yusuf", address: "45 Opebi Rd, Ikeja", service_area_id: saIds[0], company_id: compData[0].id, company_name: "GreenBin Ltd", title: "Overflowing dumpster on Opebi Road", description: "The communal dumpster near the junction has been overflowing for 3 days", status: "Assigned" },
      { household_id: hhData[1].id, household_name: "Emeka Nwosu", address: "8 Admiralty Way, Lekki", service_area_id: saIds[1], title: "Illegal dumping site", description: "People are dumping waste in the empty lot behind the estate", status: "New" },
      { household_id: hhData[0].id, household_name: "Amina Yusuf", address: "45 Opebi Rd, Ikeja", service_area_id: saIds[0], company_id: compData[0].id, company_name: "GreenBin Ltd", title: "Missed scheduled pickup", description: "Pickup was scheduled for Monday but nobody came", status: "Resolved" },
    ]);

    // Notifications
    await supabaseAdmin.from("notifications").insert([
      { user_id: userIds["amina@gmail.com"], title: "Pickup Assigned", message: "Your waste pickup request has been assigned to GreenBin Ltd.", read: false },
      { user_id: userIds["amina@gmail.com"], title: "Issue Update", message: "Your reported issue 'Overflowing dumpster' has been assigned to a company.", read: true },
      { user_id: userIds["ops@greenbin.ng"], title: "New Pickup Assignment", message: "A new pickup request has been assigned to your company.", read: false },
      { user_id: userIds["admin@cleancollect.ng"], title: "System Ready", message: "CleanCollect demo data has been seeded successfully.", read: false },
      { user_id: userIds["emeka@gmail.com"], title: "Welcome to CleanCollect", message: "Your account has been created. Request your first pickup!", read: true },
    ]);

    return new Response(JSON.stringify({ success: true, message: "Demo data seeded successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
