import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { Envelope } from "@/models/envelope";
import { RegisterVolunteerProps } from "@/models/requests/RegisterVolunteerProps";
import { Result } from "@/models/result";

export async function createVolunteerRequest(data: RegisterVolunteerProps): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}VolunteerRequests/creation-volunteer-request`, {
        firstName: data.firstName,
        secondName: data.secondName,
        patronymic: data.patronymic,
        email: data.email,
        phoneNumber: data.phoneNumber,
        workExperience: data.workExperience,
        volunteerDescription: data.volunteerDescription,
    });
}
