import { useContext } from "react";
import { AuthContext } from "@/modules/user/infra/services/contexts/AuthProvider";
import { AuthContextData } from "@/modules/user/infra/services/contexts/types";
import { OutOfContextError } from "@/modules/shared/infra/errors/out-of-context-error";

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext) as AuthContextData;

  if (!context || Object.keys(context).length <= 0) {
    throw new OutOfContextError("AuthContext");
  }

  return context;
}
