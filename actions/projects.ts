"use server";

import { getUser } from "@/lib/auth";
import { createSupabaseClient } from "@/supabase/server-client";

/**
 * Create a new project (with unique name validation)
 */
export async function createProjectAction(name: string) {
  try {
    const user = await getUser();
    if (!user) return { error: "User not authenticated", success: false };

    const supabase = await createSupabaseClient();

    // Check if project name already exists for the user
    const { data: existingProject } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", name)
      .single();

    if (existingProject) {
      return { error: "Project name already exists", success: false };
    }

    const { data, error } = await supabase
      .from("projects")
      .insert([{ name, user_id: user.id }])
      .select();

    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error("Error creating project:", error);
    return { error: "Failed to create project", success: false };
  }
}

/**
 * Get all projects for the authenticated user
 */
export async function getProjectsAction() {
  try {
    const user = await getUser();
    if (!user) return { error: "User not authenticated", success: false };

    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { error: "Failed to fetch projects", success: false };
  }
}

/**
 * Update a project name
 */
export async function updateProjectAction(projectId: string, newName: string) {
  try {
    const user = await getUser();
    if (!user) return { error: "User not authenticated", success: false };

    const supabase = await createSupabaseClient();

    // Check if the new project name already exists
    const { data: existingProject } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", newName)
      .single();

    if (existingProject) {
      return { error: "Project name already exists", success: false };
    }

    const { data, error } = await supabase
      .from("projects")
      .update({ name: newName })
      .eq("id", projectId)
      .eq("user_id", user.id)
      .select();

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error("Error updating project:", error);
    return { error: "Failed to update project", success: false };
  }
}

/**
 * Delete a project
 */
export async function deleteProjectAction(projectId: string) {
  try {
    const user = await getUser();
    if (!user) return { error: "User not authenticated", success: false };

    const supabase = await createSupabaseClient();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", user.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { error: "Failed to delete project", success: false };
  }
}
