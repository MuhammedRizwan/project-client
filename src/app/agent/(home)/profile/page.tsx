"use client";
import AgentProfile from "@/components/agent/agent-profile/AgentProfile";
import { change_agent_password, fetch_agent_profile, update_agent_profile, validate_agent_password } from "@/config/agent/authservice";
import Agent from "@/interfaces/agent";
import { addAgent } from "@/store/reducer/agentReducer";
import { RootState } from "@/store/store";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

 interface PasswordChangeFormValues {
    oldPassword?: string;
    newPassword: string;
    confirmPassword: string;
  }

export default function Profile() {
  const agentData = useSelector((state: RootState) => state.agent.agent);
  const [agent, setAgent] = useState<Agent | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch_agent_profile(agentData?._id);
        if (response.success) {
          setAgent(response.agent);
        }
      } catch (error) {
       console.log(error);
      }
    };

    fetchUserData();
  }, [agentData?._id]);
  const handleSubmit = async (data: Agent) => {
    try {
      const response = await update_agent_profile(agentData?._id,data);
      if (response.success) {
        toast.success(response.message);
        dispatch(addAgent(response.agent));
        setAgent(response.agent);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Profile update failed");
      } else {
        toast.error("Something went wrong while updating profile");
      }
    }
  };

  const passwordSubmit = async (data: PasswordChangeFormValues) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      const oldPassword= data.oldPassword
      const validateResponse = await validate_agent_password(agentData?._id,{oldPassword  });

      if (!validateResponse.success) {
        toast.error("Old password is incorrect");
        return;
      }

      const updateResponse = await change_agent_password(agentData?._id,{ newPassword: data.newPassword });

      if (updateResponse.success) {
        toast.success("Password changed successfully!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Password change failed");
      } else {
        toast.error("Something went wrong while changing password");
      }
    }
  };

  return (
    agent && (
      <AgentProfile agent={agent} onSubmit={handleSubmit} passwordSubmit={passwordSubmit} />
    )
  );
}
