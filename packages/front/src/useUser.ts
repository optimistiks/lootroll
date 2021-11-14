import { useCallback, useEffect } from "react";
import { signInAnonymously, getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useQuery, useQueryClient } from "react-query";

export function useUser() {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useQuery("user", () => {
    const auth = getAuth();
    return new Promise<User | null>((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        unsub();
        resolve(user);
      });
    });
  });
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      queryClient.setQueryData("user", user);
    });
    return () => {
      unsub();
    };
  }, [queryClient]);
  const getUserKey = useCallback(async () => {
    let userKey;
    if (user) {
      userKey = user.uid;
    } else {
      const auth = getAuth();
      const userCredential = await signInAnonymously(auth);
      userKey = userCredential.user.uid;
    }
    return userKey;
  }, [user]);
  return { user, userKey: user ? user.uid : null, isUserLoading, getUserKey };
}
