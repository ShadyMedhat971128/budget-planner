import {create} from "zustand"
import { supabase } from "@/utils/supabase";
import { Session , User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  initialize: () => void;
}


const useAuthStore = create<AuthState>(
    ((set) =>({
    user : null ,
    session : null,
    isLoading : true,
    signIn : async ()=>{
            
    },
    signUp : async ()=>{

    },
    logOut:async ()=>{

    },
    initialize: ()=>{
            console.log("inside the initialize");    
            // Job 1: recover session
            supabase.auth.getSession().then(({ data: { session } }) => {
                set({ session, user: session?.user ?? null, isLoading: false });
            });
            // Job 2: listen for changes
            supabase.auth.onAuthStateChange((_event, session) => {
                set({ session, user: session?.user ?? null });
            });
    }
})))

export default useAuthStore;