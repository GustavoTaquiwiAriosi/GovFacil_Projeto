export interface Task {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    startDate: string;
    endDate: string;
    status: string;
    userId: number;
}