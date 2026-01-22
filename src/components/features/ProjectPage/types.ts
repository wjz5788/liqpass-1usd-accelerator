import { ProjectData, EventItem } from '../../../services/mock/projectData';

export interface ProjectPageProps {
    data: ProjectData;
}

export interface EventGridProps {
    events: EventItem[];
}
