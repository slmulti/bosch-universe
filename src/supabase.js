import { createClient } from "@supabase/supabase-js";
// require("dotenv").config();

const supabaseUrl = "https://smrymzgcbdfnqqgjzwpw.supabase.co";
const supabaseKey =


const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
