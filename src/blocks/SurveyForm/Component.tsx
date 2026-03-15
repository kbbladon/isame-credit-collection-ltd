'use client'
import React, { useState } from 'react'
import { Star } from 'lucide-react'
import type { SurveyFormBlock, Survey } from '@/payload-types'
import RichText from '@/components/RichText'

type SurveyQuestion = NonNullable<NonNullable<Survey['questions']>[number]>

type SurveyFormProps = SurveyFormBlock & {
  survey?: Survey | null
}

export const SurveyFormComponent: React.FC<SurveyFormProps> = ({ survey, title, description }) => {
  const [answers, setAnswers] = useState<Record<number, string | number | boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!survey) {
    return <div className="p-4 text-red-500">Survey not found.</div>
  }

  const handleChange = (index: number, value: string | number | boolean) => {
    setAnswers((prev) => ({ ...prev, [index]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: survey.id,
          answers,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
      } else {
        alert(data.error || 'Submission failed')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-8 bg-green-50 border border-green-200 rounded-lg">
        {survey.thankYouMessage ? (
          <RichText data={survey.thankYouMessage} />
        ) : (
          <p className="text-green-800">Thank you for your feedback!</p>
        )}
      </div>
    )
  }

  const displayTitle = title || survey.title
  const displayDescription = description || survey.description

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      {displayTitle && <h2 className="text-2xl font-bold mb-2">{displayTitle}</h2>}
      {displayDescription && <p className="text-gray-600 mb-6">{displayDescription}</p>}
      <div className="space-y-6">
        {survey.questions?.map((q, idx) => {
          const question = q as SurveyQuestion
          if (!question) return null
          return (
            <div key={idx}>
              <label className="block font-medium mb-1">
                {question.questionText}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {question.questionType === 'text' && (
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  onChange={(e) => handleChange(idx, e.target.value)}
                  required={question.required}
                />
              )}
              {question.questionType === 'textarea' && (
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={4}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  required={question.required}
                />
              )}
              {question.questionType === 'yesno' && (
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      value="yes"
                      className="mr-2"
                      onChange={() => handleChange(idx, 'yes')}
                      required={question.required}
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      value="no"
                      className="mr-2"
                      onChange={() => handleChange(idx, 'no')}
                      required={question.required}
                    />
                    No
                  </label>
                </div>
              )}
              {question.questionType === 'rating' && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleChange(idx, star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          answers[idx] >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
