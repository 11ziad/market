import { createClient } from '@supabase/supabase-js'

// القيم من صفحة API Settings
const supabaseUrl = 'https://icdtdxtmpppztmwifuyb.supabase.co'
const supabaseKey = 'sb_publishable_ei_L3bsrJs4oGASDGoy9Sg_CdLezqja'

export const supabase = createClient(supabaseUrl, supabaseKey)