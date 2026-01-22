import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../../components/layout/Header'
import ProjectHeader from '../../../components/features/ProjectPage/ProjectHeader'
import ProjectRadarPanel from '../../../components/features/ProjectPage/ProjectRadarPanel'
import WindowControlPanel from '../../../components/features/ProjectPage/WindowControlPanel'
import OpportunityStrip from '../../../components/features/ProjectPage/OpportunityStrip'
import EventGrid from '../../../components/features/ProjectPage/EventGrid'
import EvidenceFeed from '../../../components/features/ProjectPage/EvidenceFeed'
import IndexBasketPanel from '../../../components/features/ProjectPage/IndexBasketPanel'
import {
  mockProjectData,
  ProjectData,
} from '../../../services/mock/projectData'
import { useProjects } from '../../../hooks/useProjects'
import { inferPhase } from '../../../services/utils/heatScore'

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { getProjectById, selectedProject, isLoading, error } = useProjects(
    undefined,
    true
  )

  useEffect(() => {
    if (!id) return
    void getProjectById(id)
  }, [getProjectById, id])

  const data: ProjectData | null = useMemo(() => {
    if (!selectedProject) return null

    const phase = inferPhase(selectedProject)
    const tags = Array.from(
      new Set([
        ...mockProjectData.tags,
        phase,
        ...(selectedProject.isLive ? ['LIVE'] : []),
      ])
    )

    return {
      ...mockProjectData,
      id: selectedProject.id,
      name: selectedProject.name,
      description: selectedProject.description,
      verified: Boolean(selectedProject.website || selectedProject.github),
      tags,
      links: {
        ...mockProjectData.links,
        demo: selectedProject.website ?? mockProjectData.links.demo,
        repo: selectedProject.github ?? mockProjectData.links.repo,
        x: selectedProject.twitter ?? mockProjectData.links.x,
      },
    }
  }, [selectedProject])

  if (!id) {
    return (
      <div className='min-h-screen bg-stripe-50 text-stripe-900 flex items-center justify-center'>
        Missing project id.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-stripe-50 text-stripe-900 flex items-center justify-center'>
        <div className='w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-stripe-50 text-stripe-900 flex items-center justify-center'>
        <div className='text-sm text-danger'>Error: {error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='min-h-screen bg-stripe-50 text-stripe-900 flex items-center justify-center'>
        Project not found.
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-stripe-50 text-stripe-900'>
      <Header />

      <main className='max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-6'>
        <ProjectHeader data={data} />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-64'>
          <div className='lg:col-span-2 h-full'>
            <ProjectRadarPanel data={data} />
          </div>
          <div className='card h-full'>
            <WindowControlPanel data={data} />
          </div>
        </div>

        <OpportunityStrip data={data} />

        <EventGrid events={data.events} />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2'>
            <EvidenceFeed data={data} />
          </div>
          <div>
            <IndexBasketPanel data={data} />
          </div>
        </div>

        <div className='border-t border-gray-200 pt-8 pb-12 text-center text-xs text-stripe-500'>
          <p>Decentralized Verification Protocol. Not financial advice.</p>
        </div>
      </main>
    </div>
  )
}

export default ProjectPage
