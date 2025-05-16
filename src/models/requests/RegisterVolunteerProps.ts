import { RegisterProps } from "@/models/requests/RegisterProps";

export interface RegisterVolunteerProps extends RegisterProps {
    phoneNumber: string;
    workExperience: number;
    volunteerDescription: string;
}
