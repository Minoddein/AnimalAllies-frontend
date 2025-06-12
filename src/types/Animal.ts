export interface Animal {
    id: string;
    name: string;
    type: string;
    breed: string;
    age: string;
    gender: "male" | "female" | "unknown";
    status: "needs_help" | "looking_for_home" | "adopted";
    location: string;
    image: string;
    dateAdded: string;
    description?: string;
    birthDate?: string;
    arrivalDate?: string;
    lastOwner?: string;
    source?: "stray" | "shelter" | "person";
    color?: string;
    height?: string;
    weight?: string;
    healthStatus?: string;
    shelterAddress?: string;
}
