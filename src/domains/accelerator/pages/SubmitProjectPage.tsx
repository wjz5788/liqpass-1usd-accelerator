import React, { useState, ChangeEvent, FormEvent, SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export type StageOption = 'MVP 进行中' | '已上线运营'

export interface CreateProjectBasicInfoFormValues {
  name: string
  tagline: string
  website: string
  twitter: string
  github: string
  stage: StageOption
  coverImage: File | null
  shortVideo: File | null
  longVideo: File | null
}

type FormErrors = Partial<
  Record<keyof CreateProjectBasicInfoFormValues, string>
>

export const SubmitProjectPage: React.FC = () => {
  const [formValues, setFormValues] =
    useState<CreateProjectBasicInfoFormValues>({
      name: '',
      tagline: '',
      website: '',
      twitter: '',
      github: '',
      stage: 'MVP 进行中',
      coverImage: null,
      shortVideo: null,
      longVideo: null,
    })

  const [errors, setErrors] = useState<FormErrors>({})
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
  const [shortVideoPreviewUrl, setShortVideoPreviewUrl] = useState<
    string | null
  >(null)
  const [longVideoPreviewUrl, setLongVideoPreviewUrl] = useState<string | null>(
    null
  )
  const [shortVideoWarning, setShortVideoWarning] = useState<string | null>(
    null
  )
  const [longVideoWarning, setLongVideoWarning] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null

    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl)
    }

    setFormValues(prev => ({ ...prev, coverImage: file }))
    setErrors(prev => ({ ...prev, coverImage: undefined }))

    if (file) {
      setCoverPreviewUrl(URL.createObjectURL(file))
    } else {
      setCoverPreviewUrl(null)
    }
  }

  const handleShortVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null

    if (shortVideoPreviewUrl) {
      URL.revokeObjectURL(shortVideoPreviewUrl)
    }

    setFormValues(prev => ({ ...prev, shortVideo: file }))
    setErrors(prev => ({ ...prev, shortVideo: undefined }))
    setShortVideoWarning(null)

    if (file) {
      setShortVideoPreviewUrl(URL.createObjectURL(file))
    } else {
      setShortVideoPreviewUrl(null)
    }
  }

  const handleLongVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null

    if (longVideoPreviewUrl) {
      URL.revokeObjectURL(longVideoPreviewUrl)
    }

    setFormValues(prev => ({ ...prev, longVideo: file }))
    setErrors(prev => ({ ...prev, longVideo: undefined }))
    setLongVideoWarning(null)

    if (file) {
      setLongVideoPreviewUrl(URL.createObjectURL(file))
    } else {
      setLongVideoPreviewUrl(null)
    }
  }

  const handleShortVideoMetadataLoaded = (
    e: SyntheticEvent<HTMLVideoElement>
  ) => {
    const duration = e.currentTarget.duration
    if (duration < 3 || duration > 5) {
      setShortVideoWarning(
        '当前视频时长不在 3–5 秒内，建议重新上传（不影响提交）。'
      )
    } else {
      setShortVideoWarning(null)
    }
  }

  const handleLongVideoMetadataLoaded = (
    e: SyntheticEvent<HTMLVideoElement>
  ) => {
    const duration = e.currentTarget.duration
    if (duration > 300) {
      setLongVideoWarning(
        '当前视频超过 5 分钟，建议裁剪为 5 分钟以内（不影响提交）。'
      )
    } else {
      setLongVideoWarning(null)
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formValues.name.trim()) {
      newErrors.name = '项目名称为必填项'
    }

    const tagline = formValues.tagline.trim()
    if (!tagline) {
      newErrors.tagline = '一句话介绍为必填项'
    } else if (tagline.length > 80) {
      newErrors.tagline = '一句话介绍最多 80 个字符'
    }

    const website = formValues.website.trim()
    if (!website) {
      newErrors.website = '项目网站为必填项'
    } else if (!/^https?:\/\//.test(website)) {
      newErrors.website = '项目网站必须以 http:// 或 https:// 开头'
    }

    if (!formValues.twitter.trim()) {
      newErrors.twitter = 'Twitter 为必填项'
    }

    if (!formValues.github.trim()) {
      newErrors.github = 'GitHub 为必填项'
    }

    if (!formValues.coverImage) {
      newErrors.coverImage = '请上传项目封面图'
    }

    if (!formValues.shortVideo) {
      newErrors.shortVideo = '请上传 3–5 秒超短视频'
    }

    if (!formValues.longVideo) {
      newErrors.longVideo = '请上传 Demo / 路演视频'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    try {
      // TODO: 调用后端 API
      const submitData = new FormData()

      // 添加基础字段
      Object.keys(formValues).forEach(key => {
        if (
          key !== 'coverImage' &&
          key !== 'shortVideo' &&
          key !== 'longVideo'
        ) {
          const value =
            formValues[key as keyof CreateProjectBasicInfoFormValues]
          if (value !== null && value !== undefined) {
            submitData.append(key, value.toString())
          }
        }
      })

      // 添加文件
      if (formValues.coverImage)
        submitData.append('coverImage', formValues.coverImage)
      if (formValues.shortVideo)
        submitData.append('shortVideo', formValues.shortVideo)
      if (formValues.longVideo)
        submitData.append('longVideo', formValues.longVideo)

      console.log('提交数据:', Object.fromEntries(submitData))

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSubmitted(true)
    } catch (error) {
      console.error('提交失败:', error)
      alert('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
          <button
            onClick={() => navigate(-1)}
            className='btn btn-secondary inline-flex items-center space-x-2 mb-6'
          >
            <ArrowLeft className='h-4 w-4' />
            返回
          </button>

          <div className='card p-8 text-center'>
            <div className='w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CheckCircle2 className='h-8 w-8 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              提交成功！
            </h2>
            <p className='text-gray-600 mb-6'>
              项目已提交成功。我们会在审核后，通过邮箱联系你。
            </p>
            <button
              onClick={() => navigate(`/projects/liqpass`)}
              className='btn btn-primary'
            >
              查看项目页面
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <button
          onClick={() => navigate(-1)}
          className='btn btn-secondary inline-flex items-center space-x-2 mb-6'
        >
          <ArrowLeft className='h-4 w-4' />
          返回
        </button>

        <h1 className='text-4xl font-bold text-gray-900 mb-4'>提交新项目</h1>
        <p className='text-xl text-gray-600 mb-8'>
          填写项目基本信息并上传相关媒体文件
        </p>

        <form className='w-full' onSubmit={handleSubmit}>
          <div className='flex gap-6'>
            {/* 左侧：表单内容 */}
            <div className='flex-1 space-y-6'>
              {/* 项目信息 */}
              <section className='card p-6 space-y-4'>
                <div>
                  <h2 className='text-lg font-semibold text-gray-900'>
                    项目信息
                  </h2>
                  <p className='mt-1 text-sm text-gray-600'>
                    创建后，项目信息将用于展示和匹配，不支持随意修改。
                  </p>
                </div>

                {/* 项目名称 + 阶段 */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <label className='block text-sm font-medium text-gray-700'>
                      项目名称<div className='text-red-500'>*</div>
                    </label>
                    <input
                      name='name'
                      value={formValues.name}
                      onChange={handleInputChange}
                      className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500'
                      placeholder='例如：LiqPass · 爆仓保护 OS'
                    />
                    {errors.name && (
                      <div className='text-xs text-red-500'>{errors.name}</div>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label className='block text-sm font-medium text-gray-700'>
                      项目阶段<div className='text-red-500'>*</div>
                    </label>
                    <select
                      name='stage'
                      value={formValues.stage}
                      onChange={handleInputChange}
                      className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500'
                    >
                      <option value='MVP 进行中'>MVP 进行中</option>
                      <option value='已上线运营'>已上线运营</option>
                    </select>
                  </div>
                </div>

                {/* 一句话介绍 */}
                <div className='space-y-1'>
                  <label className='block text-sm font-medium text-gray-700'>
                    一句话介绍<div className='text-red-500'>*</div>
                  </label>
                  <input
                    name='tagline'
                    value={formValues.tagline}
                    onChange={handleInputChange}
                    className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500'
                    placeholder='最多 80 字，快速说明项目做什么'
                  />
                  <div className='flex justify-between text-xs'>
                    <div className='text-red-500'>
                      {errors.tagline ? errors.tagline : null}
                    </div>
                    <div className='text-gray-500'>
                      {formValues.tagline.length}/80
                    </div>
                  </div>
                </div>

                {/* 网站 */}
                <div className='space-y-1'>
                  <label className='block text-sm font-medium text-gray-700'>
                    项目网站<div className='text-red-500'>*</div>
                  </label>
                  <input
                    name='website'
                    value={formValues.website}
                    onChange={handleInputChange}
                    className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500'
                    placeholder='https://your-project.com'
                  />
                  {errors.website && (
                    <div className='text-xs text-red-500'>{errors.website}</div>
                  )}
                </div>

                {/* Social links 区块 */}
                <div className='space-y-3'>
                  <div className='text-sm font-medium text-gray-700'>
                    社交链接<div className='text-red-500'>*</div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-1'>
                      <label className='block text-sm text-gray-600'>
                        Twitter
                      </label>
                      <input
                        name='twitter'
                        value={formValues.twitter}
                        onChange={handleInputChange}
                        className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500'
                        placeholder='https://twitter.com/your_project'
                      />
                      {errors.twitter && (
                        <div className='text-xs text-red-500'>
                          {errors.twitter}
                        </div>
                      )}
                    </div>
                    <div className='space-y-1'>
                      <label className='block text-sm text-gray-600'>
                        GitHub
                      </label>
                      <input
                        name='github'
                        value={formValues.github}
                        onChange={handleInputChange}
                        className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500'
                        placeholder='https://github.com/your_org/your_repo'
                      />
                      {errors.github && (
                        <div className='text-xs text-red-500'>
                          {errors.github}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* 媒体上传卡片：类似 Select video or image */}
              <section className='card p-6 space-y-4'>
                <div>
                  <h2 className='text-sm font-semibold text-gray-900'>
                    媒体上传
                  </h2>
                  <p className='mt-1 text-xs text-gray-600'>
                    封面图 + 两段视频将一起用在广场展示页和项目详情页。
                  </p>
                </div>

                {/* 封面图 */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <label className='block text-sm font-medium text-gray-700'>
                      项目封面图<div className='text-red-500'>*</div>
                    </label>
                    <div className='text-xs text-gray-500'>
                      建议 1:1 方图，最小 1000×1000px
                    </div>
                  </div>
                  <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleCoverChange}
                      className='block w-full text-sm text-gray-700'
                    />
                    <p className='mt-2 text-xs text-gray-500'>
                      选择一张封面图或拖拽到此处。
                    </p>
                  </div>
                  {errors.coverImage && (
                    <div className='text-xs text-red-500'>
                      {errors.coverImage}
                    </div>
                  )}
                  {coverPreviewUrl && (
                    <div className='mt-2'>
                      <p className='text-xs text-gray-600 mb-1'>封面预览：</p>
                      <img
                        src={coverPreviewUrl}
                        alt='封面预览'
                        className='max-h-40 rounded-md border border-gray-200 object-contain'
                      />
                    </div>
                  )}
                </div>

                {/* 短视频 */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <label className='block text-sm font-medium text-gray-700'>
                      3–5 秒超短视频<div className='text-red-500'>*</div>
                    </label>
                    <div className='text-xs text-gray-500'>
                      建议 16:9 或 9:16，1080p+
                    </div>
                  </div>
                  <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center'>
                    <input
                      type='file'
                      accept='video/*'
                      onChange={handleShortVideoChange}
                      className='block w-full text-sm text-gray-700'
                    />
                    <p className='mt-2 text-xs text-gray-500'>
                      建议上传 3–5
                      秒的超短视频，用画面快速展示项目核心画面即可，
                      可以只有画面、不配解说。
                    </p>
                  </div>
                  {errors.shortVideo && (
                    <div className='text-xs text-red-500'>
                      {errors.shortVideo}
                    </div>
                  )}
                  {shortVideoPreviewUrl && (
                    <div className='mt-2 space-y-1'>
                      <p className='text-xs text-gray-600'>短视频预览：</p>
                      <video
                        src={shortVideoPreviewUrl}
                        controls
                        className='w-full max-h-52 rounded-md border border-gray-200'
                        onLoadedMetadata={handleShortVideoMetadataLoaded}
                      />
                      {shortVideoWarning && (
                        <p className='text-xs text-yellow-500'>
                          {shortVideoWarning}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 长视频 */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Demo / 路演视频（≤ 5 分钟）
                      <div className='text-red-500'>*</div>
                    </label>
                    <div className='text-xs text-gray-500'>
                      最长 5 分钟，建议 16:9，1080p+
                    </div>
                  </div>
                  <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center'>
                    <input
                      type='file'
                      accept='video/*'
                      onChange={handleLongVideoChange}
                      className='block w-full text-sm text-gray-700'
                    />
                    <p className='mt-2 text-xs text-gray-500'>
                      用你最熟悉的语言录制完整 Demo /
                      路演视频，不用刻意改成英文。
                    </p>
                  </div>
                  {errors.longVideo && (
                    <div className='text-xs text-red-500'>
                      {errors.longVideo}
                    </div>
                  )}
                  {longVideoPreviewUrl && (
                    <div className='mt-2 space-y-1'>
                      <p className='text-xs text-gray-600'>长视频预览：</p>
                      <video
                        src={longVideoPreviewUrl}
                        controls
                        className='w-full max-h-64 rounded-md border border-gray-200'
                        onLoadedMetadata={handleLongVideoMetadataLoaded}
                      />
                      {longVideoWarning && (
                        <p className='text-xs text-yellow-500'>
                          {longVideoWarning}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 文件大小和比例提示 */}
                <div className='mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-3'>
                  <div className='text-sm text-gray-600 space-y-1'>
                    <div className='font-medium text-gray-700'>
                      文件大小与格式
                    </div>
                    <ul className='list-disc list-inside space-y-0.5'>
                      <li>图片：建议 &lt; 15MB，.jpg / .png / .gif</li>
                      <li>视频：建议 &lt; 30MB，.mp4 优先</li>
                    </ul>
                  </div>
                  <div className='text-sm text-gray-600 space-y-1'>
                    <div className='font-medium text-gray-700'>
                      分辨率与比例
                    </div>
                    <ul className='list-disc list-inside space-y-0.5'>
                      <li>封面图：最小 1000×1000px，方图推荐</li>
                      <li>视频：16:9 或 9:16，1080p 或更高</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 提交按钮 */}
              <div className='flex justify-end'>
                <button
                  type='submit'
                  disabled={submitting}
                  className='px-4 py-2 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors'
                >
                  {submitting ? '提交中...' : '创建项目'}
                </button>
              </div>
            </div>

            {/* 右侧：预览卡片 */}
            <aside className='hidden lg:block w-64'>
              <div className='card p-4 h-full'>
                <h3 className='text-sm font-semibold text-gray-900 mb-3'>
                  预览
                </h3>
                <div className='rounded-lg border border-gray-200 bg-white overflow-hidden h-full flex flex-col shadow-sm'>
                  {coverPreviewUrl ? (
                    <img
                      src={coverPreviewUrl}
                      alt='项目封面预览'
                      className='w-full h-32 object-cover'
                    />
                  ) : (
                    <div className='w-full h-32 flex items-center justify-center text-xs text-gray-500 border-b border-gray-200 bg-gray-50'>
                      项目封面预览
                    </div>
                  )}
                  <div className='p-3 space-y-1 flex-1 flex flex-col'>
                    <div className='text-xs text-gray-500 mb-1'>
                      {formValues.stage || '项目阶段'}
                    </div>
                    <div className='text-sm font-semibold text-gray-900 truncate'>
                      {formValues.name || '项目名称预览'}
                    </div>
                    <div className='text-xs text-gray-600 line-clamp-3 mt-1'>
                      {formValues.tagline || '一句话介绍会展示在这里。'}
                    </div>
                    <div className='mt-auto pt-2 border-t border-gray-200 text-xs text-gray-500'>
                      这是用户在广场/列表中看到的大致样子。
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubmitProjectPage
