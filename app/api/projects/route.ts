import { NextResponse } from "next/server";
import { createProjectAction, getProjectsAction, updateProjectAction, deleteProjectAction } from "@/actions/projects";

export async function GET() {
  const result = await getProjectsAction();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const result = await createProjectAction(name);
  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const { projectId, newName } = await request.json();
  const result = await updateProjectAction(projectId, newName);
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const { projectId } = await request.json();
  const result = await deleteProjectAction(projectId);
  return NextResponse.json(result);
}