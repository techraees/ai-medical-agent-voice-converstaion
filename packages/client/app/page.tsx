import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Database, Globe, Smartphone, Zap, Github, Linkedin, Mail } from 'lucide-react'

const HomePortfolio = () => {
   return (
      <div className="min-h-screen bg-background">
         {/* First Section - About/Hero */}
         <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
               <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Rana Raees</h1>
                  <p className="text-xl md:text-2xl text-muted-foreground">Senior Software Engineer</p>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                     Passionate about building innovative solutions and creating exceptional user experiences.
                     Specialized in full-stack development with expertise in modern web technologies.
                  </p>
               </div>

               <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <Button size="lg" variant="default">
                     <Github className="mr-2 h-5 w-5" />
                     GitHub
                  </Button>
                  <Button size="lg" variant="outline">
                     <Linkedin className="mr-2 h-5 w-5" />
                     LinkedIn
                  </Button>
                  <Button size="lg" variant="outline">
                     <Mail className="mr-2 h-5 w-5" />
                     Contact
                  </Button>
               </div>
            </div>
         </section>

         {/* Second Section - Skills/Expertise */}
         <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="space-y-8">
               <div className="text-center space-y-2">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Skills & Expertise</h2>
                  <p className="text-muted-foreground">Technologies and tools I work with</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                     <CardHeader>
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-primary/10">
                              <Code className="h-6 w-6 text-primary" />
                           </div>
                           <CardTitle>Frontend Development</CardTitle>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <CardDescription>
                           React, Next.js, TypeScript, Tailwind CSS, and modern UI frameworks. Building responsive and
                           interactive user interfaces.
                        </CardDescription>
                     </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                     <CardHeader>
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-primary/10">
                              <Database className="h-6 w-6 text-primary" />
                           </div>
                           <CardTitle>Backend Development</CardTitle>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <CardDescription>
                           Node.js, RESTful APIs, Database design, and server-side architecture. Creating scalable and
                           efficient backend systems.
                        </CardDescription>
                     </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                     <CardHeader>
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-primary/10">
                              <Smartphone className="h-6 w-6 text-primary" />
                           </div>
                           <CardTitle>Mobile Development</CardTitle>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <CardDescription>
                           Cross-platform mobile app development with React Native. Delivering native-like experiences
                           on iOS and Android.
                        </CardDescription>
                     </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                     <CardHeader>
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-primary/10">
                              <Globe className="h-6 w-6 text-primary" />
                           </div>
                           <CardTitle>Full-Stack Solutions</CardTitle>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <CardDescription>
                           End-to-end application development from concept to deployment. Full-stack expertise for
                           complete product solutions.
                        </CardDescription>
                     </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                     <CardHeader>
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-primary/10">
                              <Zap className="h-6 w-6 text-primary" />
                           </div>
                           <CardTitle>Performance Optimization</CardTitle>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <CardDescription>
                           Optimizing applications for speed, scalability, and efficiency. Ensuring optimal performance
                           and user experience.
                        </CardDescription>
                     </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                     <CardHeader>
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-primary/10">
                              <Github className="h-6 w-6 text-primary" />
                           </div>
                           <CardTitle>DevOps & Tools</CardTitle>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <CardDescription>
                           CI/CD pipelines, version control, cloud deployment, and modern development tools.
                           Streamlining development workflows.
                        </CardDescription>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </section>
      </div>
   )
}

export default HomePortfolio
