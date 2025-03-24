export interface Chat {
    id: string;
    userId: string;
    title: string;
}

export type ArtifactKind = "text" | "image" | "code" | "sheet"