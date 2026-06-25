import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const userId = url.searchParams.get("userId");
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      const limit = url.searchParams.get("limit");

      if (!userId) {
        return new Response(JSON.stringify({ error: "User ID is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, username")
        .eq("id", userId)
        .single();

      if (userError || !user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let query = supabase
        .from("exercises")
        .select("description, duration, date")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (from) {
        query = query.gte("date", from);
      }
      if (to) {
        query = query.lte("date", to);
      }
      if (limit) {
        query = query.limit(parseInt(limit));
      }

      const { data: exercises, error: exercisesError } = await query;

      if (exercisesError) {
        return new Response(JSON.stringify({ error: exercisesError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const log = exercises.map((e) => ({
        description: e.description,
        duration: e.duration,
        date: new Date(e.date).toDateString(),
      }));

      return new Response(
        JSON.stringify({
          username: user.username,
          count: log.length,
          _id: user.id,
          log,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
