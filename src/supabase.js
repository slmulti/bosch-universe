import { createClient } from "@supabase/supabase-js";
// require("dotenv").config();

const supabaseUrl = "https://smrymzgcbdfnqqgjzwpw.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcnltemdjYmRmbnFxZ2p6d3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc4NDMyMjcsImV4cCI6MTk5MzQxOTIyN30.g-nQvd0eiX6n_vEiAmU1HM35TnzidpA0Zi2VILQ5-uM";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
