import React from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Star } from 'lucide-react'

// Local type matching the block config until types are generated
type TestimonialItem = {
  quote: any // rich text object
  name: string
  role?: string | null
  photo?: any // Media object or string
  rating?: '1' | '2' | '3' | '4' | '5' | null
  id?: string | null
}

type TestimonialsBlockProps = {
  headline?: string | null
  testimonials?: TestimonialItem[] | null
}

export const TestimonialsBlockComponent: React.FC<TestimonialsBlockProps> = ({
  headline,
  testimonials,
}) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {headline && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{headline}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials?.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              {/* Rating */}
              {item.rating && (
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < parseInt(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              {/* Quote */}
              <div className="text-gray-700 mb-4">
                <RichText data={item.quote} />
              </div>
              {/* Author */}
              <div className="flex items-center">
                {item.photo && typeof item.photo === 'object' && (
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <Media resource={item.photo} className="object-cover w-full h-full" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  {item.role && <p className="text-sm text-gray-600">{item.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
