export interface VolunteerRequest {
    id: string;
    createdAt: Date;
    requestStatus: "Waiting" | "Submitted" | "Rejected" | "RevisionRequired" | "Approved";
    firstName: string;
    secondName: string;
    patronymic: string;
    email: string;
    phoneNumber: string;
    volunteerDescription: string;
    workExperience: string;
    adminId?: string;
    userId?: string;
    discussionId?: string;
    rejectionComment?: string;
}
