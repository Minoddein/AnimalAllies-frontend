// types/animal.ts
export interface PetPhysicCharacteristicsDto {
    color: string;
    healthInformation: string;
    weight: number;
    height: number;
}

export interface PetDetailsDto {
    description: string;
    birthDate: string; // ISO date string
}

export interface AddressDto {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface AnimalTypeDto {
    speciesId: string;
    breedId: string;
}

export interface HistoryDto {
    arriveTime: string; // ISO date string
    lastOwner: string;
    from: string;
}

export interface TemperamentDto {
    aggressionLevel: number;
    friendliness: number;
    activityLevel: number;
    goodWithKids: boolean;
    goodWithPeople: boolean;
    goodWithOtherAnimals: boolean;
}

export interface MedicalInfoDto {
    isSpayedNeutered: boolean;
    isVaccinated: boolean;
    lastVaccinationDate: string | null; // ISO date string
    hasChronicDiseases: boolean;
    medicalNotes: string | null;
    requiresSpecialDiet: boolean;
    hasAllergies: boolean;
}

export interface RequisiteDto {
    title: string;
    description: string;
}

export interface AddPetRequest {
    name: string;
    petPhysicCharacteristicsDto: PetPhysicCharacteristicsDto;
    petDetailsDto: PetDetailsDto;
    addressDto: AddressDto;
    phoneNumber: string;
    helpStatus: string;
    animalTypeDto: AnimalTypeDto;
    animalSex: string;
    historyDto: HistoryDto;
    temperamentDto?: TemperamentDto | null;
    medicalInfoDto?: MedicalInfoDto | null;
    requisitesDto: RequisiteDto[];
}

export interface PetDto {
    petId: string;
    petName: string;
    color: string;
    healthInformation: string;
    weight: number;
    height: number;
    description: string;
    birthDate: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    helpStatus: string;
    volunteerId: string;
    petSpeciesId: string;
    petBreedId: string;
    speciesName: string;
    breedName: string;
    requisites: RequisiteDto[];
    petPhotos: PetPhotoDto[];
    isDeleted: boolean;

    arriveDate?: string;
    lastOwner?: string;
    from?: string;

    sex?: string;

    isSpayedNeutered?: boolean;
    isVaccinated?: boolean;
    lastVaccinationDate?: string;
    hasChronicDiseases?: boolean;
    medicalNotes?: string;
    requiresSpecialDiet?: boolean;
    hasAllergies?: boolean;

    aggressionLevel?: number;
    friendliness?: number;
    activityLevel?: number;
    goodWithKids?: boolean;
    goodWithPeople?: boolean;
    goodWithOtherAnimals?: boolean;
}

export interface RequisiteDto {
    title: string;
    description: string;
}

export interface PetPhotoDto {
    path: string;
    isMain: boolean;
}
