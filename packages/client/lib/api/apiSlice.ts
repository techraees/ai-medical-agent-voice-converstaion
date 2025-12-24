import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Doctor {
   id: string
   name: string
   specialty: string
   description: string
   image: string
   isPremium: boolean
}

export interface Consultation {
   id: string
   doctorId: string
   doctorName: string
   description: string
   date: string
   status: 'completed' | 'ongoing'
}

export interface ChatMessage {
   id: string
   role: 'user' | 'assistant'
   content: string
   timestamp: string
}

export const apiSlice = createApi({
   baseQuery: fetchBaseQuery({
      baseUrl: '/api',
   }),
   tagTypes: ['Doctors', 'Consultations', 'Chat'],
   endpoints: (builder) => ({
      getDoctors: builder.query<Doctor[], void>({
         query: () => '/doctors',
         providesTags: ['Doctors'],
      }),
      getDoctorById: builder.query<Doctor, string>({
         query: (id) => `/doctors/${id}`,
         providesTags: ['Doctors'],
      }),
      getConsultations: builder.query<Consultation[], void>({
         query: () => '/consultations',
         providesTags: ['Consultations'],
      }),
      getConsultationById: builder.query<Consultation, string>({
         query: (id) => `/consultations/${id}`,
         providesTags: ['Consultations'],
      }),
      sendMessage: builder.mutation<{ message: ChatMessage }, { doctorId: string; message: string }>({
         query: ({ doctorId, message }) => ({
            url: `/chat/${doctorId}`,
            method: 'POST',
            body: { message },
         }),
         invalidatesTags: ['Chat'],
      }),
      getChatHistory: builder.query<ChatMessage[], string>({
         query: (doctorId) => `/chat/${doctorId}/history`,
         providesTags: ['Chat'],
      }),
   }),
})

export const {
   useGetDoctorsQuery,
   useGetDoctorByIdQuery,
   useGetConsultationsQuery,
   useGetConsultationByIdQuery,
   useSendMessageMutation,
   useGetChatHistoryQuery,
} = apiSlice
