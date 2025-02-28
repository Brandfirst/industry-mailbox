
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Search, Shield, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  useEffect(() => {
    document.title = "NewsletterHub - Norges største nyhetsbrev arkiv";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-1">
        {/* Announcement Banner */}
        <div className="bg-black border border-white/10 rounded-full py-2 px-6 mx-auto mt-8 max-w-max flex items-center gap-2">
          <span className="animate-pulse relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <p className="text-sm text-white font-medium">New! Newsletter 2.0 Live Now!</p>
        </div>
        
        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden mesh-gradient">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <div className="animate-slide-down">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white">
                The Complete
                <span className="block text-gray-300 mt-2 relative">
                  Winning Ad Workflow
                  <div className="absolute -bottom-2 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Save ads, build briefs and produce high converting Facebook & TikTok ads at scale, without compromising quality.
              </p>
              <div className="flex justify-center mb-14">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              
              {/* App Mockup */}
              <div className="relative mx-auto max-w-4xl">
                <div className="bg-dark-300 rounded-lg overflow-hidden shadow-2xl border border-white/10">
                  {/* Browser Header */}
                  <div className="bg-dark-400 h-8 flex items-center px-3 border-b border-white/10">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto flex items-center bg-dark-500 rounded-md px-2 py-1">
                      <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-xs text-gray-400">app.foreplay.co/swipe-file</span>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="bg-dark-300 flex">
                    {/* Sidebar */}
                    <div className="bg-[#0a1227] w-48 border-r border-white/10 py-4 hidden md:block">
                      <div className="px-4 mb-6">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16L7 11L8.4 9.55L12 13.15L15.6 9.55L17 11L12 16Z" fill="currentColor"/>
                          </svg>
                          <span className="text-white font-medium">foreplay</span>
                        </div>
                      </div>
                      <div className="space-y-1 px-2">
                        <div className="bg-blue-500/20 text-blue-400 rounded-md py-1.5 px-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="currentColor"/>
                          </svg>
                          <span className="text-sm">Swipe File</span>
                        </div>
                        <div className="text-gray-400 rounded-md py-1.5 px-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" fill="currentColor"/>
                          </svg>
                          <span className="text-sm">Brands</span>
                        </div>
                        <div className="text-gray-400 rounded-md py-1.5 px-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                          </svg>
                          <span className="text-sm">Discovery</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 px-4 py-4">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-white text-sm font-medium">Swipe File</h3>
                          <p className="text-gray-400 text-xs">Save & organize ads from Facebook Ad Library & TikTok</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">My Ads</div>
                          <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Brands</div>
                          <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Tutorial</div>
                          <Button size="sm" className="bg-blue-500 text-white text-xs rounded-md">Create New</Button>
                        </div>
                      </div>
                      
                      {/* Search Bar */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center bg-dark-400 rounded-md px-3 py-1.5 w-64">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-xs text-gray-400">Search Ads...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-dark-400 rounded-md px-3 py-1.5">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="text-xs text-gray-400">Filters</span>
                          </div>
                          <div className="flex items-center bg-dark-400 rounded-md px-3 py-1.5">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                            <span className="text-xs text-gray-400">Sort By</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Ad Grid */}
                      <div className="grid grid-cols-4 gap-4">
                        {/* Ad Card 1 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <img 
                              src="/lovable-uploads/bc6da6c1-6e77-4e9a-a2cd-554f46a925e6.png" 
                              alt="Ad Preview"
                              className="w-full h-40 object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-white rounded-full p-1">
                              <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                                P
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 flex gap-1">
                              <button className="bg-white/80 rounded-full p-1">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
                                </svg>
                              </button>
                              <button className="bg-white/80 rounded-full p-1">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="p-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs font-medium">PetLab Co.</div>
                              <div className="text-xs text-gray-500">1 Day Ago</div>
                            </div>
                            <div className="bg-yellow-100 rounded px-2 py-1 text-center">
                              <span className="text-xs font-bold text-yellow-800">New Doggy Mouthwash</span>
                              <span className="block text-xs font-bold text-yellow-800">Explained</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Ad Card 2 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-40 bg-pink-200 flex items-center justify-center">
                              <div className="text-center px-4">
                                <h3 className="text-pink-800 font-bold">TAKE CONTROL</h3>
                                <h3 className="text-pink-800 font-bold">OF YOUR WEIGHT</h3>
                                <div className="bg-pink-400 text-white rounded-full px-3 py-1 mt-2 mx-auto text-xs font-bold">BURN</div>
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-white rounded-full p-1">
                              <div className="bg-pink-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                                O
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs font-medium">Obvi</div>
                              <div className="text-xs text-gray-500">1 Day Ago</div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="bg-gray-100 rounded px-2 py-0.5">
                                <span className="text-xs text-gray-600">#health_wellness</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Ad Card 3 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-40 bg-green-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="rounded-full border-2 border-green-600 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                                  <span className="text-green-600 font-bold">AG1</span>
                                </div>
                                <p className="text-green-800 text-sm">Eight ounces of water.</p>
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-white rounded-full p-1">
                              <div className="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                                D
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs font-medium">Drink AG1</div>
                              <div className="text-xs text-gray-500">2 Days Ago</div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <div className="text-xs text-gray-700">April 2, 2023</div>
                              <div className="text-xs text-gray-700">Still Running</div>
                              <div className="text-xs text-gray-700">22 Days</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Ad Card 4 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-40 bg-blue-100 flex items-center justify-center">
                              <div className="text-center px-4">
                                <h3 className="text-blue-800 font-bold">The</h3>
                                <h3 className="text-blue-800 font-bold">Cool-Down</h3>
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-white rounded-full p-1">
                              <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                                V
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs font-medium">Vuori</div>
                              <div className="text-xs text-gray-500">3 Days Ago</div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="bg-gray-100 rounded px-2 py-0.5">
                                <span className="text-xs text-gray-600">#fashion_static</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-16 px-4 bg-black">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="text-gray-500 mb-10">Loved by 5,000+ Brands & Agencies</p>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
              {/* Row 1 */}
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M10.2 5.6H13.5V18.4H10.2V5.6ZM18.9 5.6H15.6V18.4H18.9V5.6ZM14.7 2.3H17.1V4.7H14.7V2.3Z" fill="currentColor"/>
                  <path d="M27.1991 13.1998L25.1991 9.1998H25.0991L23.1991 13.1998H27.1991ZM25.7991 5.5998L31.7991 18.3998H28.2991L27.0991 15.7998H23.2991L22.0991 18.3998H18.5991L24.5991 5.5998H25.7991Z" fill="currentColor"/>
                  <path d="M32.1 18.4V5.6H37.1C38.9667 5.6 40.4 6.03333 41.4 6.9C42.4 7.76667 42.9 9 42.9 10.6C42.9 12.2 42.4 13.4333 41.4 14.3C40.4 15.1667 38.9667 15.6 37.1 15.6H35.4V18.4H32.1ZM35.4 12.6H36.3C37.0333 12.6 37.5667 12.4667 37.9 12.2C38.2333 11.9333 38.4 11.5 38.4 10.9C38.4 10.3 38.2333 9.86667 37.9 9.6C37.5667 9.33333 37.0333 9.2 36.3 9.2H35.4V12.6Z" fill="currentColor"/>
                  <path d="M43.4 12C43.4 9.66667 44.0333 7.9 45.3 6.7C46.5667 5.5 48.3333 4.9 50.6 4.9C52.8667 4.9 54.6333 5.5 55.9 6.7C57.1667 7.9 57.8 9.66667 57.8 12C57.8 14.3333 57.1667 16.1 55.9 17.3C54.6333 18.5 52.8667 19.1 50.6 19.1C48.3333 19.1 46.5667 18.5 45.3 17.3C44.0333 16.1 43.4 14.3333 43.4 12ZM47 12C47 13.2 47.2667 14.1333 47.8 14.8C48.3333 15.4667 49.3 15.8 50.7 15.8C52.0333 15.8 52.9667 15.4667 53.5 14.8C54.0333 14.1333 54.3 13.2 54.3 12C54.3 10.8 54.0333 9.86667 53.5 9.2C52.9667 8.53333 52.0333 8.2 50.7 8.2C49.3 8.2 48.3333 8.53333 47.8 9.2C47.2667 9.86667 47 10.8 47 12Z" fill="currentColor"/>
                  <path d="M59.1 18.4V5.6H62.4V15.6H66.3V18.4H59.1Z" fill="currentColor"/>
                  <path d="M67.5 18.4V5.6H70.8V18.4H67.5Z" fill="currentColor"/>
                  <path d="M72.7 12C72.7 9.66667 73.3333 7.9 74.6 6.7C75.8667 5.5 77.6333 4.9 79.9 4.9C82.1667 4.9 83.9333 5.5 85.2 6.7C86.4667 7.9 87.1 9.66667 87.1 12C87.1 14.3333 86.4667 16.1 85.2 17.3C83.9333 18.5 82.1667 19.1 79.9 19.1C77.6333 19.1 75.8667 18.5 74.6 17.3C73.3333 16.1 72.7 14.3333 72.7 12ZM76.3 12C76.3 13.2 76.5667 14.1333 77.1 14.8C77.6333 15.4667 78.6 15.8 80 15.8C81.3333 15.8 82.2667 15.4667 82.8 14.8C83.3333 14.1333 83.6 13.2 83.6 12C83.6 10.8 83.3333 9.86667 82.8 9.2C82.2667 8.53333 81.3333 8.2 80 8.2C78.6 8.2 77.6333 8.53333 77.1 9.2C76.5667 9.86667 76.3 10.8 76.3 12Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="66" height="24" viewBox="0 0 66 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M5.4 5H13.2V8.2H8.9V10.5H12.9V13.5H8.9V16H13.4V19H5.4V5Z" fill="currentColor"/>
                  <path d="M23 5L27.5 19H23.7L23.1 16.7H19.4L18.8 19H15L19.5 5H23ZM22.4 13.8L21.3 9.4H21.2L20.1 13.8H22.4Z" fill="currentColor"/>
                  <path d="M32.8 8.1V19H29.4V8.1H26.3V5H35.9V8.1H32.8Z" fill="currentColor"/>
                  <path d="M45.1 19V5H48.5V19H45.1Z" fill="currentColor"/>
                  <path d="M59.4 19L55.3 10.7H55.2V19H51.8V5H55.7L59.6 13.1H59.7V5H63.1V19H59.4Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="140" height="24" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M13.9 5.1L7.9 19.3H4.8L0 5.1H3.7L6.5 15.1H6.6L9.4 5.1H13.9Z" fill="currentColor"/>
                  <path d="M22.5 19.3L22 17.5H21.9C21.4 18.2 20.8 18.7 20.2 19.1C19.5 19.4 18.7 19.6 17.7 19.6C16.3 19.6 15.3 19.2 14.5 18.4C13.7 17.6 13.3 16.5 13.3 15.1C13.3 13.6 13.8 12.5 14.9 11.7C16 10.9 17.5 10.5 19.6 10.4L21.7 10.3V9.7C21.7 9 21.5 8.4 21.1 8.1C20.7 7.7 20.1 7.5 19.3 7.5C18.6 7.5 18 7.6 17.4 7.8C16.8 8 16.2 8.3 15.7 8.6L14.6 6.5C15.3 6.1 16.1 5.7 16.9 5.5C17.8 5.2 18.6 5.1 19.5 5.1C21.3 5.1 22.6 5.5 23.5 6.4C24.4 7.3 24.8 8.6 24.8 10.3V19.3H22.5ZM21.7 12.4L20.5 12.5C19.5 12.5 18.8 12.7 18.3 13.1C17.8 13.5 17.5 14 17.5 14.8C17.5 15.4 17.7 15.9 18 16.2C18.3 16.5 18.8 16.7 19.4 16.7C20.2 16.7 20.9 16.4 21.4 15.9C21.9 15.4 22.2 14.7 22.2 13.9V12.4H21.7Z" fill="currentColor"/>
                  <path d="M36.8 5.1V7.6H32.8V19.3H29.6V7.6H25.6V5.1H36.8Z" fill="currentColor"/>
                  <path d="M37.5 19.3V5.1H40.8V19.3H37.5Z" fill="currentColor"/>
                  <path d="M50.9 7.6H47.1V11.6H50.5V14.1H47.1V19.3H43.9V5.1H51.3L50.9 7.6Z" fill="currentColor"/>
                  <path d="M58 5.1V19.3H54.8V5.1H58Z" fill="currentColor"/>
                  <path d="M68.1 19.3L67.6 17.5H67.5C67 18.2 66.4 18.7 65.8 19.1C65.1 19.4 64.3 19.6 63.3 19.6C61.9 19.6 60.9 19.2 60.1 18.4C59.3 17.6 58.9 16.5 58.9 15.1C58.9 13.6 59.4 12.5 60.5 11.7C61.6 10.9 63.1 10.5 65.2 10.4L67.3 10.3V9.7C67.3 9 67.1 8.4 66.7 8.1C66.3 7.7 65.7 7.5 64.9 7.5C64.2 7.5 63.6 7.6 63 7.8C62.4 8 61.8 8.3 61.3 8.6L60.2 6.5C60.9 6.1 61.7 5.7 62.5 5.5C63.4 5.2 64.2 5.1 65.1 5.1C66.9 5.1 68.2 5.5 69.1 6.4C70 7.3 70.4 8.6 70.4 10.3V19.3H68.1ZM67.3 12.4L66.1 12.5C65.1 12.5 64.4 12.7 63.9 13.1C63.4 13.5 63.1 14 63.1 14.8C63.1 15.4 63.3 15.9 63.6 16.2C63.9 16.5 64.4 16.7 65 16.7C65.8 16.7 66.5 16.4 67 15.9C67.5 15.4 67.8 14.7 67.8 13.9V12.4H67.3Z" fill="currentColor"/>
                  <path d="M83.9 5.1V19.3H80.7V7.7H80.6L77.3 10.1L76 7.9L80.3 5.1H83.9Z" fill="currentColor"/>
                  <path d="M97.4 19.3H93.6L90.2 13.5H90.1V19.3H86.8V5.1H90.1V13H90.2L93.5 7.5H97.2L93.3 13.9L97.4 19.3Z" fill="currentColor"/>
                  <path d="M106.6 19.3L106.1 17.5H106C105.5 18.2 104.9 18.7 104.3 19.1C103.6 19.4 102.8 19.6 101.8 19.6C100.4 19.6 99.4 19.2 98.6 18.4C97.8 17.6 97.4 16.5 97.4 15.1C97.4 13.6 97.9 12.5 99 11.7C100.1 10.9 101.6 10.5 103.7 10.4L105.8 10.3V9.7C105.8 9 105.6 8.4 105.2 8.1C104.8 7.7 104.2 7.5 103.4 7.5C102.7 7.5 102.1 7.6 101.5 7.8C100.9 8 100.3 8.3 99.8 8.6L98.7 6.5C99.4 6.1 100.2 5.7 101 5.5C101.9 5.2 102.7 5.1 103.6 5.1C105.4 5.1 106.7 5.5 107.6 6.4C108.5 7.3 108.9 8.6 108.9 10.3V19.3H106.6ZM105.8 12.4L104.6 12.5C103.6 12.5 102.9 12.7 102.4 13.1C101.9 13.5 101.6 14 101.6 14.8C101.6 15.4 101.8 15.9 102.1 16.2C102.4 16.5 102.9 16.7 103.5 16.7C104.3 16.7 105 16.4 105.5 15.9C106 15.4 106.3 14.7 106.3 13.9V12.4H105.8Z" fill="currentColor"/>
                  <path d="M123.6 19.3H120.4V11.5C120.4 10.7 120.2 10.1 119.9 9.7C119.6 9.3 119.1 9.1 118.5 9.1C117.7 9.1 117.1 9.4 116.6 10.1C116.1 10.7 115.9 11.7 115.9 13.1V19.3H112.6V5.1H115.2L115.6 6.9H115.8C116.2 6.2 116.7 5.7 117.4 5.4C118.1 5.2 118.8 5.1 119.6 5.1C121.8 5.1 123.2 6 123.8 7.8H124.1C124.5 6.9 125.1 6.2 125.8 5.7C126.5 5.3 127.3 5.1 128.2 5.1C129.7 5.1 130.9 5.5 131.6 6.4C132.3 7.3 132.7 8.6 132.7 10.5V19.3H129.4V11.5C129.4 10.7 129.2 10.1 128.9 9.7C128.6 9.3 128.1 9.1 127.5 9.1C126.7 9.1 126.1 9.4 125.6 10C125.1 10.6 124.9 11.6 124.9 12.9V19.3H123.6Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M10.5 4H4V20H10.5C13.5 20 16 17.5 16 12C16 6.5 13.5 4 10.5 4ZM10.3 16.8H7.2V7.2H10.3C11.9 7.2 12.8 8.9 12.8 12C12.8 15.1 11.9 16.8 10.3 16.8Z" fill="currentColor"/>
                  <path d="M25.8 20.2C22.4 20.2 19.8 17.7 19.8 14.3C19.8 10.9 22.3 8.4 25.7 8.4C29.1 8.4 31.7 10.9 31.7 14.3C31.7 17.7 29.2 20.2 25.8 20.2ZM25.8 11.2C24.1 11.2 22.9 12.6 22.9 14.3C22.9 16 24.1 17.4 25.8 17.4C27.5 17.4 28.7 16.1 28.7 14.3C28.7 12.5 27.5 11.2 25.8 11.2Z" fill="currentColor"/>
                  <path d="M40.3 20.2C36.9 20.2 34.3 17.7 34.3 14.3C34.3 10.9 36.8 8.4 40.2 8.4C43.6 8.4 46.2 10.9 46.2 14.3C46.2 17.7 43.7 20.2 40.3 20.2ZM40.3 11.2C38.6 11.2 37.4 12.6 37.4 14.3C37.4 16 38.6 17.4 40.3 17.4C42 17.4 43.2 16.1 43.2 14.3C43.2 12.5 42 11.2 40.3 11.2Z" fill="currentColor"/>
                  <path d="M56.4 11.1C55.3 11.1 53.7 11.7 53.7 13.1V20H50.7V8.6H53.5V10C54.1 9 55.7 8.4 56.8 8.4C57.2 8.4 57.5 8.5 57.8 8.5V11.3C57.3 11.2 56.9 11.1 56.4 11.1Z" fill="currentColor"/>
                  <path d="M59 8.6H62V20H59V8.6Z" fill="currentColor"/>
                  <path d="M72.5 20H69.7V18.7C68.9 19.6 67.5 20.2 65.9 20.2C63.5 20.2 62 18.8 62 16.5C62 13.7 64.3 12.8 67 12.8H69.5V12.4C69.5 11.2 68.8 10.5 67.2 10.5C65.8 10.5 64.9 11.2 64.7 12.1L62.1 11.2C62.5 9.3 64.6 8.3 67.3 8.3C70.7 8.3 72.5 9.9 72.5 13V20ZM69.5 15.2V14.9H67.5C65.9 14.9 65 15.4 65 16.6C65 17.5 65.6 18 66.8 18C68.5 18 69.5 16.9 69.5 15.2Z" fill="currentColor"/>
                  <path d="M83.4 20H80.6V18.7C79.9 19.6 78.6 20.2 77.1 20.2C74.2 20.2 72 17.9 72 14.3C72 10.7 74.2 8.4 77.1 8.4C78.6 8.4 79.9 9 80.6 9.9V4H83.6V20H83.4ZM77.8 17.4C79.5 17.4 80.6 16.1 80.6 14.3C80.6 12.5 79.5 11.2 77.8 11.2C76.1 11.2 75 12.5 75 14.3C75 16.1 76.1 17.4 77.8 17.4Z" fill="currentColor"/>
                  <path d="M94.3 8.6V10.9H91.4V20H88.4V10.9H86.7V8.6H88.4V5.7H91.4V8.6H94.3Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="140" height="24" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M13.8 4H9.2L4 20H8.6L9.6 16.8H13.4L14.4 20H19L13.8 4ZM10.4 13.6L11.6 9.4L12.8 13.6H10.4Z" fill="currentColor"/>
                  <path d="M28.5 16.6L24.9 8.6H21.1V20H24.5V12L28.1 20H28.9L32.5 12V20H35.9V8.6H32.1L28.5 16.6Z" fill="currentColor"/>
                  <path d="M50 8.6V11.2H44.4V12.8H48.8V15.4H44.4V17.4H50.2V20H41V8.6H50Z" fill="currentColor"/>
                  <path d="M59.6 8.6V11.2H56.4V20H53V11.2H49.8V8.6H59.6Z" fill="currentColor"/>
                  <path d="M66.7 20.2C63.3 20.2 60.7 17.7 60.7 14.3C60.7 10.9 63.2 8.4 66.6 8.4C70 8.4 72.6 10.9 72.6 14.3C72.6 17.7 70.1 20.2 66.7 20.2ZM66.7 11.2C65 11.2 63.8 12.6 63.8 14.3C63.8 16 65 17.4 66.7 17.4C68.4 17.4 69.6 16.1 69.6 14.3C69.6 12.5 68.4 11.2 66.7 11.2Z" fill="currentColor"/>
                  <path d="M82.1 20H78.7V12.2C78.7 11.5 78.2 11.2 77.7 11.2C76.6 11.2 76.2 11.9 76.2 13.2V20H72.8V8.6H76V9.6C76.4 8.9 77.5 8.4 78.9 8.4C81.1 8.4 82.2 9.9 82.2 12.2V20H82.1Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M20.8 10H20.2C19.6 8.7 18.5 8 17 8C14.5 8 12.8 9.9 12.8 12.7C12.8 15.5 14.5 17.4 17 17.4C18.5 17.4 19.6 16.7 20.2 15.4H20.8V16.1C20.8 18.1 19.5 19.4 17.3 19.4C16 19.4 14.9 19 14.3 18.1L12.3 19.6C13.3 21 14.9 21.7 17.3 21.7C20.7 21.7 23 19.6 23 16.1V8.2H20.8V10ZM17.3 15.1C15.9 15.1 15 14.1 15 12.7C15 11.3 15.9 10.3 17.3 10.3C18.7 10.3 19.6 11.3 19.6 12.7C19.6 14.1 18.7 15.1 17.3 15.1Z" fill="currentColor"/>
                  <path d="M31.5 8.2H26.8V4.2H24.6V21.4H26.8V10.5H31.5V8.2Z" fill="currentColor"/>
                  <path d="M32.8 14.8C32.8 18.5 35.4 21.7 39.7 21.7C42.2 21.7 44.1 20.5 45.2 18.6L43.2 17.1C42.4 18.4 41.2 19 39.7 19C37.3 19 35.7 17.3 35.2 15.2H45.5C45.5 15 45.5 14.7 45.5 14.5C45.5 10.6 43.2 7.7 39.5 7.7C35.4 7.7 32.8 10.9 32.8 14.8ZM35.2 13C35.6 10.9 37.1 9.5 39.5 9.5C41.7 9.5 43.2 10.9 43.6 13H35.2Z" fill="currentColor"/>
                  <path d="M54.5 8H50.6V4.2H48.4V8H46V10.3H48.4V17.5C48.4 20.3 50.1 21.5 52.6 21.5C53.6 21.5 54.4 21.3 55 21L54.4 18.8C54 19 53.6 19.1 53 19.1C51.9 19.1 51.2 18.5 51.2 17.3V10.3H54.5V8Z" fill="currentColor"/>
                  <path d="M63.6 8H63C61.8 8 60.8 8.7 60.3 9.8V8.2H58.1V21.4H60.3V14.4C60.3 11.9 61.5 10.4 63.4 10.4H64.1L63.6 8Z" fill="currentColor"/>
                  <path d="M64.9 14.8C64.9 18.5 67.5 21.7 71.8 21.7C74.3 21.7 76.2 20.5 77.3 18.6L75.3 17.1C74.5 18.4 73.3 19 71.8 19C69.4 19 67.8 17.3 67.3 15.2H77.6C77.6 15 77.6 14.7 77.6 14.5C77.6 10.6 75.3 7.7 71.6 7.7C67.5 7.7 64.9 10.9 64.9 14.8ZM67.3 13C67.7 10.9 69.2 9.5 71.6 9.5C73.8 9.5 75.3 10.9 75.7 13H67.3Z" fill="currentColor"/>
                </svg>
              </div>
              
              {/* Row 2 */}
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M16.6 4H12V20H16.6V4Z" fill="currentColor"/>
                  <path d="M31.2 8.6L27.6 16.6L24 8.6H20.2V20H23.6V12L27.2 20H28L31.6 12V20H35V8.6H31.2Z" fill="currentColor"/>
                  <path d="M44.2 8.6V11.2H41V20H37.6V11.2H34.4V8.6H44.2Z" fill="currentColor"/>
                  <path d="M52.8 8.4C49.4 8.4 46.8 10.9 46.8 14.3C46.8 17.7 49.3 20.2 52.7 20.2C56.1 20.2 58.7 17.7 58.7 14.3C58.7 10.9 56.2 8.4 52.8 8.4ZM52.8 17.4C51.1 17.4 49.9 16 49.9 14.3C49.9 12.6 51.1 11.2 52.8 11.2C54.5 11.2 55.7 12.5 55.7 14.3C55.7 16.1 54.5 17.4 52.8 17.4Z" fill="currentColor"/>
                  <path d="M67.7 12V20H64.3V12.2C64.3 11.5 63.8 11.2 63.3 11.2C62.2 11.2 61.8 11.9 61.8 13.2V20H58.4V8.6H61.6V9.6C62 8.9 63.1 8.4 64.5 8.4C66.7 8.4 67.7 9.9 67.7 12Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 9.5C11.4 9.5 10.9 9.6 10.5 9.9C10.1 10.2 9.9 10.5 9.9 10.9C9.9 11.3 10.1 11.6 10.4 11.8C10.7 12 11.5 12.3 12.7 12.6C14.2 13 15.3 13.5 16 14.1C16.7 14.7 17.1 15.6 17.1 16.8C17.1 18 16.6 19 15.7 19.7C14.8 20.4 13.6 20.8 12.1 20.8C11 20.8 9.9 20.6 9 20.1C8.1 19.6 7.3 19 6.9 18.2L8.8 16.9C9.5 18 10.6 18.6 12.1 18.6C12.8 18.6 13.3 18.4 13.8 18.2C14.2 17.9 14.4 17.6 14.4 17.1C14.4 16.6 14.2 16.3 13.9 16C13.6 15.7 12.9 15.5 11.8 15.2C10.3 14.8 9.2 14.3 8.5 13.7C7.8 13.1 7.4 12.2 7.4 11C7.4 9.9 7.9 8.9 8.7 8.2C9.6 7.5 10.7 7.1 12.1 7.1C12.9 7.1 13.8 7.3 14.6 7.6C15.4 7.9 16 8.3 16.5 8.8L14.8 10.3C14.2 9.8 13.2 9.5 12 9.5Z" fill="currentColor"/>
                  <path d="M23.4 9.9V15.4C23.4 16.3 23.9 16.8 24.9 16.8C25.9 16.8 26.4 16.3 26.4 15.4V9.9H28.9V15.7C28.9 17.1 28.5 18.1 27.8 18.8C27.1 19.5 26.1 19.8 24.9 19.8C23.7 19.8 22.7 19.5 22 18.8C21.3 18.1 20.9 17.1 20.9 15.7V9.9H23.4Z" fill="currentColor"/>
                  <path d="M35 20.6L30.6 9.9H33.4L35.3 15.2C35.5 15.8 35.7 16.5 35.9 17.4C36 16.8 36.2 16.1 36.5 15.2L38.4 9.9H41.2L36.8 20.6H35Z" fill="currentColor"/>
                  <path d="M47.2 9.9V12.1H43.9V20.6H41.4V12.1H38.1V9.9H47.2Z" fill="currentColor"/>
                  <path d="M49.6 20.6V7.2H52.1V17.6H56.9V20.6H49.6Z" fill="currentColor"/>
                  <path d="M64.1 20.6H57.3V7.2H64.1V10H59.8V12.2H63.6V15H59.8V17.8H64.1V20.6Z" fill="currentColor"/>
                  <path d="M70.9 13.6L67.9 9.9H71L72.7 12.3L74.4 9.9H77.4L74.4 13.6L77.8 20.6H74.8L72.7 16.6L70.6 20.6H67.5L70.9 13.6Z" fill="currentColor"/>
                  <path d="M85.3 20.6V16.9L85.4 15.1V9.9H87.9V20.6H85.3Z" fill="currentColor"/>
                  <path d="M94.9 20.6V16.9L95 15.1V9.9H97.5V20.6H94.9Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M14 5H28V9.5H19.5V11.8H27.5V16H19.5V19H28.5V23.5H14V5Z" fill="currentColor"/>
                  <path d="M34.5 5V12.8H34.6L40.6 5H45.9L38.8 13.5L46.6 23.5H41.1L34.6 15H34.5V23.5H30V5H34.5Z" fill="currentColor"/>
                  <path d="M52.5 9.5V14H61V18.5H52.5V23.5H48V5H63V9.5H52.5Z" fill="currentColor"/>
                  <path d="M69 23.5V5H73.5V19H82.5V23.5H69Z" fill="currentColor"/>
                  <path d="M101.5 20C99.8 22.5 97.2 24 94.5 24C88.9 24 85 19.8 85 14.5C85 9.2 88.9 5 94.5 5C97.2 5 99.8 6.5 101.5 9L97.8 11.5C96.9 10 95.8 9 94.3 9C91.7 9 89.9 11.3 89.9 14.5C89.9 17.7 91.7 20 94.3 20C95.9 20 97 19 97.8 17.5L101.5 20Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 19.5C11.3 19.5 10.6 19.4 9.9 19.1C9.2 18.8 8.6 18.4 8.1 17.9L9.6 16.4C10.1 16.9 10.5 17.2 11 17.4C11.4 17.6 11.9 17.7 12.3 17.7C12.8 17.7 13.1 17.6 13.4 17.4C13.7 17.2 13.8 17 13.8 16.6C13.8 16.4 13.7 16.2 13.6 16C13.5 15.9 13.3 15.7 13.1 15.6C12.9 15.5 12.7 15.4 12.4 15.3C12.1 15.2 11.8 15.1 11.4 15C11 14.9 10.7 14.7 10.3 14.6C9.9 14.4 9.6 14.2 9.4 14C9.1 13.8 8.9 13.5 8.7 13.2C8.5 12.9 8.5 12.5 8.5 12C8.5 11.5 8.6 11.1 8.8 10.7C9 10.3 9.2 10 9.6 9.7C9.9 9.4 10.3 9.2 10.8 9.1C11.3 8.9 11.8 8.9 12.3 8.9C12.9 8.9 13.5 9 14.1 9.2C14.7 9.4 15.2 9.7 15.6 10.1L14.3 11.4C13.9 11.1 13.6 10.9 13.2 10.7C12.8 10.6 12.5 10.5 12.1 10.5C11.7 10.5 11.4 10.6 11.1 10.7C10.9 10.9 10.7 11.1 10.7 11.4C10.7 11.6 10.8 11.8 10.9 11.9C11 12 11.2 12.2 11.4 12.3C11.6 12.4 11.8 12.5 12.1 12.6C12.4 12.7 12.7 12.8 13 12.9C13.4 13 13.7 13.2 14.1 13.3C14.5 13.5 14.8 13.7 15 13.9C15.3 14.1 15.5 14.4 15.7 14.7C15.8 15 15.9 15.4 15.9 15.9C15.9 16.4 15.8 16.9 15.6 17.3C15.4 17.7 15.1 18 14.8 18.3C14.4 18.6 14 18.8 13.5 19C13 19.4 12.5 19.5 12 19.5Z" fill="currentColor"/>
                  <path d="M22.1 19.3H20.1V13.1H22.1V14.2C22.2 14 22.4 13.8 22.5 13.6C22.7 13.4 22.9 13.3 23.1 13.1C23.3 13 23.6 12.9 23.8 12.8C24.1 12.7 24.3 12.7 24.6 12.7V14.7C24.5 14.7 24.3 14.7 24.1 14.7C23.9 14.7 23.7 14.7 23.5 14.8C23.3 14.9 23.1 14.9 22.9 15C22.7 15.1 22.6 15.3 22.4 15.5C22.3 15.7 22.2 16 22.2 16.2V19.3H22.1Z" fill="currentColor"/>
                  <path d="M29 19.3H26.9V9H29V19.3Z" fill="currentColor"/>
                  <path d="M35.6 19.3H30.7V9H35.6V10.7H32.8V13H35.1V14.7H32.8V17.7H35.6V19.3Z" fill="currentColor"/>
                  <path d="M43.2 19.3H38.3V9H43.2V10.7H40.4V13H42.7V14.7H40.4V17.7H43.2V19.3Z" fill="currentColor"/>
                  <path d="M49 19.3H44.8V9H47V17.8H49V19.3Z" fill="currentColor"/>
                  <path d="M58.2 19.3H56.1V14.5H53.3V19.3H51.2V9H53.3V12.6H56.1V9H58.2V19.3Z" fill="currentColor"/>
                  <path d="M61.3 19.3V17.6H63V19.3H61.3Z" fill="currentColor"/>
                  <path d="M72.5 19.3H70.6L70.1 17.8H66.9L66.4 19.3H64.5L67.4 9H69.7L72.5 19.3ZM69.7 16.1L68.5 12.1L67.3 16.1H69.7Z" fill="currentColor"/>
                  <path d="M80.5 19.3H78.4V13.8L76.3 18.3H75.5L73.4 13.8V19.3H71.3V9H73.4L76.2 14.9L79 9H81.1V19.3H80.5Z" fill="currentColor"/>
                  <path d="M87.2 19.3H82.3V9H87.2V10.7H84.4V13H86.7V14.7H84.4V17.7H87.2V19.3Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="124" height="24" viewBox="0 0 124 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M18.8 15H13.8V20H18.8V15Z" fill="currentColor"/>
                  <path d="M18.8 7.5H13.8V12.5H18.8V7.5Z" fill="currentColor"/>
                  <path d="M11.2 0H6.2V5H11.2V0Z" fill="currentColor"/>
                  <path d="M11.2 7.5H6.2V12.5H11.2V7.5Z" fill="currentColor"/>
                  <path d="M11.2 15H6.2V20H11.2V15Z" fill="currentColor"/>
                  <path d="M3.8 15H-1.22070e-06V20H3.8V15Z" fill="currentColor"/>
                  <path d="M3.8 7.5H-1.22070e-06V12.5H3.8V7.5Z" fill="currentColor"/>
                  <path d="M3.8 0H-1.22070e-06V5H3.8V0Z" fill="currentColor"/>
                  <path d="M40.7 11.2V19.9H37.5V11.5C37.5 10.8 37.3 10.2 36.9 9.9C36.5 9.6 35.9 9.4 35.3 9.4C34.2 9.4 33.4 9.8 32.9 10.5C32.4 11.2 32.1 12.4 32.1 14.1V19.9H28.9V4.2H32.1V6.6C32.6 5.8 33.3 5.2 34.1 4.9C34.9 4.5 35.8 4.4 36.8 4.4C38.1 4.4 39.1 4.7 39.9 5.3C40.4 5.9 40.7 6.7 40.7 7.8V11.2Z" fill="currentColor"/>
                  <path d="M54.4 19.9H51.2V11.5C51.2 10.8 51 10.2 50.6 9.9C50.2 9.6 49.6 9.4 49 9.4C47.9 9.4 47.1 9.8 46.6 10.5C46.1 11.2 45.8 12.4 45.8 14.1V19.9H42.6V4.2H45.8V6.6C46.3 5.8 47 5.2 47.8 4.9C48.6 4.5 49.5 4.4 50.5 4.4C51.8 4.4 52.8 4.7 53.6 5.3C54.1 5.9 54.4 6.7 54.4 7.8V19.9Z" fill="currentColor"/>
                  <path d="M61.2 4.2V19.9H58V4.2H61.2Z" fill="currentColor"/>
                  <path d="M80.2 19.9H76.5L74.1 14.7L71.6 19.9H68.1L72.3 12.2L68.2 4.8H71.8L74.2 9.7L76.7 4.8H80.1L76 12.2L80.2 19.9Z" fill="currentColor"/>
                  <path d="M86.1 4.2V6.8H83V19.9H79.8V6.8H77.1V4.2H79.8V3.5C79.8 1.7 80.2 0.5 81.1 -0.1C81.9 -0.7 83.2 -0.9 84.9 -0.9C85.2 -0.9 85.4 -0.9 85.7 -0.9C85.9 -0.9 86.1 -0.9 86.3 -0.8V1.9C86.1 1.9 85.9 1.9 85.7 1.9C85.5 1.9 85.3 1.9 85.1 1.9C84.1 1.9 83.5 2.1 83.2 2.4C82.9 2.7 82.8 3.2 82.8 3.9V4.2H86.1Z" fill="currentColor"/>
                  <path d="M100 19.9H96.8V17.9C96.4 18.5 95.8 19 95.1 19.4C94.4 19.7 93.5 19.9 92.6 19.9C91.3 19.9 90.2 19.5 89.4 18.6C88.6 17.8 88.2 16.5 88.2 14.9V4.2H91.4V14.1C91.4 15 91.6 15.7 91.9 16.1C92.3 16.5 92.8 16.7 93.6 16.7C94.3 16.7 94.9 16.5 95.3 16.2C95.7 15.8 96 15.4 96.2 14.8C96.4 14.2 96.5 13.5 96.5 12.6V4.2H99.7V19.9H100Z" fill="currentColor"/>
                  <path d="M114.5 10.5C114.5 11.6 114.3 12.5 113.9 13.4C113.5 14.3 113 15 112.2 15.6C111.5 16.2 110.6 16.6 109.6 16.9C108.6 17.2 107.6 17.3 106.5 17.3H105V19.9H101.8V4.2H106.5C107.6 4.2 108.6 4.3 109.6 4.6C110.6 4.9 111.4 5.3 112.2 5.9C112.9 6.5 113.5 7.2 113.9 8.1C114.3 8.9 114.5 9.7 114.5 10.5ZM110.7 10.7C110.7 9.9 110.4 9.2 109.9 8.8C109.4 8.4 108.5 8.2 107.4 8.2H105V13.3H107.4C108.5 13.3 109.4 13.1 109.9 12.7C110.4 12.3 110.7 11.6 110.7 10.7Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="124" height="24" viewBox="0 0 124 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M21.9 3H11.7V7.7H21.9V3Z" fill="currentColor"/>
                  <path d="M45.6 13.4C45.6 14.5 45.4 15.5 45 16.3C44.6 17.1 44.1 17.8 43.4 18.4C42.7 18.9 41.9 19.3 41 19.6C40.1 19.9 39.1 20 38.1 20H32.2V6.8H38.1C39.1 6.8 40.1 6.9 41 7.2C41.9 7.5 42.7 7.9 43.4 8.4C44.1 8.9 44.6 9.6 45 10.4C45.4 11.2 45.6 12.2 45.6 13.4ZM41.6 13.4C41.6 12.7 41.5 12 41.3 11.5C41.1 11 40.8 10.5 40.3 10.2C39.9 9.9 39.4 9.6 38.9 9.5C38.3 9.4 37.7 9.3 37 9.3H36V17.5H37C37.7 17.5 38.3 17.4 38.9 17.3C39.5 17.2 39.9 16.9 40.3 16.6C40.7 16.3 41 15.8 41.3 15.3C41.5 14.7 41.6 14.1 41.6 13.4Z" fill="currentColor"/>
                  <path d="M51.8 20.2C50.8 20.2 49.9 20 49.1 19.7C48.3 19.4 47.6 19 47.1 18.4C46.5 17.8 46.1 17.1 45.8 16.3C45.5 15.5 45.3 14.6 45.3 13.6C45.3 12.6 45.5 11.7 45.8 10.9C46.1 10.1 46.5 9.4 47.1 8.8C47.7 8.2 48.4 7.8 49.2 7.5C50 7.2 50.9 7 51.9 7C52.9 7 53.8 7.2 54.6 7.5C55.4 7.8 56.1 8.2 56.7 8.8C57.3 9.4 57.7 10.1 58 10.9C58.3 11.7 58.5 12.6 58.5 13.6C58.5 14.6 58.3 15.5 58 16.3C57.7 17.1 57.3 17.8 56.7 18.4C56.1 19 55.4 19.4 54.6 19.7C53.8 20 52.8 20.2 51.8 20.2ZM51.8 17.7C52.7 17.7 53.5 17.4 54 16.7C54.6 16 54.8 14.9 54.8 13.6C54.8 12.3 54.5 11.2 54 10.5C53.5 9.8 52.7 9.5 51.8 9.5C50.9 9.5 50.1 9.8 49.6 10.5C49.1 11.2 48.8 12.3 48.8 13.6C48.8 14.9 49.1 16 49.6 16.7C50.1 17.4 50.9 17.7 51.8 17.7Z" fill="currentColor"/>
                  <path d="M66.2 20.2C65.3 20.2 64.5 20.1 63.7 19.8C62.9 19.5 62.2 19.1 61.7 18.6C61.1 18.1 60.7 17.4 60.4 16.7C60.1 15.9 60 15.1 60 14.2V7.2H63.4V13.7C63.4 14.1 63.4 14.5 63.5 14.9C63.6 15.3 63.7 15.6 63.9 15.9C64.1 16.2 64.3 16.4 64.7 16.6C65 16.8 65.4 16.9 65.9 16.9C66.4 16.9 66.8 16.8 67.1 16.6C67.4 16.4 67.7 16.2 67.9 15.9C68.1 15.6 68.2 15.3 68.3 14.9C68.4 14.5 68.4 14.1 68.4 13.7V7.2H71.8V14.2C71.8 15.1 71.7 15.9 71.4 16.7C71.1 17.5 70.7 18.1 70.1 18.6C69.5 19.1 68.9 19.5 68.1 19.8C67.3 20.1 66.5 20.2 66.2 20.2Z" fill="currentColor"/>
                  <path d="M83.3 20H79.9V11.6C79.9 10.9 79.7 10.3 79.3 10C78.9 9.7 78.3 9.5 77.7 9.5C76.6 9.5 75.8 9.9 75.3 10.6C74.8 11.3 74.5 12.5 74.5 14.2V20H71.3V7.3H74.5V9.2C75 8.4 75.7 7.8 76.5 7.5C77.3 7.1 78.2 7 79.2 7C80.5 7 81.5 7.3 82.3 7.9C82.8 8.5 83.1 9.3 83.1 10.4V20H83.3Z" fill="currentColor"/>
                  <path d="M95.5 16.3H89.5L88.3 20H84.9L90.6 6.8H94.4L100.1 20H96.7L95.5 16.3ZM94.6 13.8L92.5 7.9L90.4 13.8H94.6Z" fill="currentColor"/>
                  <path d="M113.3 20H109.9V11.6C109.9 10.9 109.7 10.3 109.3 10C108.9 9.7 108.3 9.5 107.7 9.5C106.6 9.5 105.8 9.9 105.3 10.6C104.8 11.3 104.5 12.5 104.5 14.2V20H101.3V7.3H104.5V9.2C105 8.4 105.7 7.8 106.5 7.5C107.3 7.1 108.2 7 109.2 7C110.5 7 111.5 7.3 112.3 7.9C112.8 8.5 113.1 9.3 113.1 10.4V20H113.3Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 bg-black">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Mail className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-white">NewsletterHub</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
              <a href="/admin" className="hover:text-gray-300 transition-colors">Admin</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} NewsletterHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
