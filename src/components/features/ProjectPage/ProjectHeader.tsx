import React from 'react'
import {
  ChevronLeft,
  Share2,
  CheckCircle,
  ExternalLink,
  Github,
  FileText,
  Twitter,
  Youtube,
} from 'lucide-react'
import { ProjectData } from '../../../services/mock/projectData'
import { Link } from 'react-router-dom'

interface ProjectHeaderProps {
  data: ProjectData
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ data }) => {
  return (
    <div className='bg-white border border-gray-200 shadow-stripe rounded-xl p-6 mb-6'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center space-x-4'>
          <Link
            to='/accelerator/projects'
            className='p-2 hover:bg-stripe-50 rounded-lg transition-colors text-stripe-500 hover:text-stripe-900'
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <div className='flex items-center space-x-3 mb-1'>
              <h1 className='text-2xl font-bold text-stripe-900 tracking-tight'>
                {data.name}
              </h1>
              {data.verified && (
                <div className='flex items-center space-x-1 px-2 py-0.5 bg-green-500/10 text-green-600 text-xs font-medium rounded-full border border-green-500/20'>
                  <CheckCircle size={12} />
                  <span>VERIFIED</span>
                </div>
              )}
              <div className='flex items-center space-x-2'>
                {data.tags.map(tag => (
                  <span
                    key={tag}
                    className='px-2 py-0.5 bg-stripe-50 text-stripe-500 text-xs rounded border border-gray-200'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className='text-stripe-500 text-sm max-w-2xl'>
              {data.description}
            </p>
          </div>
        </div>

        <button className='flex items-center space-x-2 px-3 py-2 bg-white hover:bg-stripe-50 text-stripe-600 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm'>
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      <div className='flex items-center space-x-6 text-sm py-2 border-t border-gray-200 mt-4 pt-4'>
        {data.links.demo && (
          <a
            href={data.links.demo}
            className='flex items-center space-x-2 text-stripe-500 hover:text-indigo-600 transition-colors'
          >
            <ExternalLink size={14} />
            <span>Live Demo</span>
          </a>
        )}
        {data.links.repo && (
          <a
            href={data.links.repo}
            className='flex items-center space-x-2 text-stripe-500 hover:text-indigo-600 transition-colors'
          >
            <Github size={14} />
            <span>Repository</span>
          </a>
        )}
        {data.links.docs && (
          <a
            href={data.links.docs}
            className='flex items-center space-x-2 text-stripe-500 hover:text-indigo-600 transition-colors'
          >
            <FileText size={14} />
            <span>Documentation</span>
          </a>
        )}
        {data.links.x && (
          <a
            href={data.links.x}
            className='flex items-center space-x-2 text-stripe-500 hover:text-indigo-600 transition-colors'
          >
            <Twitter size={14} />
            <span>Twitter</span>
          </a>
        )}
        {data.links.video && (
          <a
            href={data.links.video}
            className='flex items-center space-x-2 text-stripe-500 hover:text-indigo-600 transition-colors'
          >
            <Youtube size={14} />
            <span>Video Walkthrough</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectHeader
