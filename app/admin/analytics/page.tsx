"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Users, FileCheck, DollarSign, Globe, Download, Filter, RefreshCw } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

// Mock analytics data
const userGrowthData = [
  { month: "Jan", users: 120, credentials: 450 },
  { month: "Feb", users: 180, credentials: 680 },
  { month: "Mar", users: 250, credentials: 920 },
  { month: "Apr", users: 320, credentials: 1200 },
  { month: "May", users: 420, credentials: 1580 },
  { month: "Jun", users: 520, credentials: 1950 },
  { month: "Jul", users: 650, credentials: 2400 },
  { month: "Aug", users: 780, credentials: 2850 },
  { month: "Sep", users: 920, credentials: 3200 },
  { month: "Oct", users: 1050, credentials: 3600 },
  { month: "Nov", users: 1180, credentials: 3950 },
  { month: "Dec", users: 1247, credentials: 4200 },
]

const credentialTypesData = [
  { name: "Education", value: 35, count: 1470 },
  { name: "Certification", value: 28, count: 1176 },
  { name: "Work Experience", value: 20, count: 840 },
  { name: "Skills", value: 12, count: 504 },
  { name: "Projects", value: 5, count: 210 },
]

const revenueData = [
  { month: "Jan", revenue: 2400, subscriptions: 120, verifications: 450 },
  { month: "Feb", revenue: 3600, subscriptions: 180, verifications: 680 },
  { month: "Mar", revenue: 5000, subscriptions: 250, verifications: 920 },
  { month: "Apr", revenue: 6400, subscriptions: 320, verifications: 1200 },
  { month: "May", revenue: 8400, subscriptions: 420, verifications: 1580 },
  { month: "Jun", revenue: 10400, subscriptions: 520, verifications: 1950 },
]

const geographicData = [
  { country: "United States", users: 450, percentage: 36 },
  { country: "United Kingdom", users: 280, percentage: 22 },
  { country: "Canada", users: 180, percentage: 14 },
  { country: "Germany", users: 120, percentage: 10 },
  { country: "Australia", users: 90, percentage: 7 },
  { country: "Others", users: 127, percentage: 11 },
]

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6B7280"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("12m")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <AdminSidebar />

      <div className="ml-80 p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive platform insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="glass border-white/20 rounded-lg px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="12m">Last 12 months</option>
              </select>
              <Button variant="outline" className="glass border-white/20">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-green-600 text-white hover:bg-green-70 border-0 hover-glow"
              >
                {isRefreshing ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh Data
              </Button>
              <Button variant="outline" className="glass border-white/20">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          <Card className="glass-card border-white/20 hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold">$52,400</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+23% from last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold">1,247</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-600">+12% from last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Credentials Issued</p>
                  <p className="text-3xl font-bold">4,200</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                    <span className="text-sm text-purple-600">+18% from last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <FileCheck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Global Reach</p>
                  <p className="text-3xl font-bold">45</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
                    <span className="text-sm text-orange-600">+3 new countries</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analytics Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="growth" className="space-y-6">
            <TabsList className="glass border-white/20">
              <TabsTrigger value="growth">Growth Analytics</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
              <TabsTrigger value="credentials">Credential Analytics</TabsTrigger>
              <TabsTrigger value="geographic">Geographic Analytics</TabsTrigger>
            </TabsList>

            {/* Growth Analytics */}
            <TabsContent value="growth" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle>User Growth Trend</CardTitle>
                    <CardDescription>Monthly user registration and credential issuance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="credentials"
                          stackId="2"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle>Growth Rate Analysis</CardTitle>
                    <CardDescription>Month-over-month growth percentages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 glass rounded-lg">
                        <div>
                          <p className="font-medium">User Growth Rate</p>
                          <p className="text-sm text-gray-600">Average monthly growth</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">+15.2%</p>
                          <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 glass rounded-lg">
                        <div>
                          <p className="font-medium">Credential Growth Rate</p>
                          <p className="text-sm text-gray-600">Average monthly growth</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">+22.8%</p>
                          <Badge className="bg-blue-100 text-blue-800">Outstanding</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 glass rounded-lg">
                        <div>
                          <p className="font-medium">Retention Rate</p>
                          <p className="text-sm text-gray-600">90-day user retention</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">87.5%</p>
                          <Badge className="bg-purple-100 text-purple-800">Very Good</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Revenue Analytics */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="glass-card border-white/20">
                    <CardHeader>
                      <CardTitle>Revenue Breakdown</CardTitle>
                      <CardDescription>Monthly revenue from subscriptions and verifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "8px",
                              backdropFilter: "blur(10px)",
                            }}
                          />
                          <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle>Revenue Sources</CardTitle>
                    <CardDescription>Breakdown by revenue stream</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Subscriptions</span>
                        </div>
                        <span className="font-semibold">$32,400 (62%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Verifications</span>
                        </div>
                        <span className="font-semibold">$15,200 (29%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">API Access</span>
                        </div>
                        <span className="font-semibold">$3,600 (7%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">Premium Features</span>
                        </div>
                        <span className="font-semibold">$1,200 (2%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Credential Analytics */}
            <TabsContent value="credentials" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle>Credential Types Distribution</CardTitle>
                    <CardDescription>Breakdown of credential categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={credentialTypesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {credentialTypesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle>Credential Performance</CardTitle>
                    <CardDescription>Detailed breakdown by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {credentialTypesData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between p-3 glass rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.count} credentials</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{item.value}%</p>
                            <p className="text-xs text-gray-500">of total</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Geographic Analytics */}
            <TabsContent value="geographic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle>Global User Distribution</CardTitle>
                    <CardDescription>Users by country and region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {geographicData.map((country, index) => (
                        <div key={country.country} className="flex items-center justify-between p-3 glass rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">
                              {country.country.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{country.country}</p>
                              <p className="text-sm text-gray-600">{country.users} users</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{country.percentage}%</p>
                            <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${country.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle>Market Insights</CardTitle>
                    <CardDescription>Regional performance and opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 glass rounded-lg border-l-4 border-l-green-500">
                        <h4 className="font-semibold text-green-800">Top Performing Region</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          North America leads with 58% of total users and highest engagement rates
                        </p>
                      </div>
                      <div className="p-4 glass rounded-lg border-l-4 border-l-blue-500">
                        <h4 className="font-semibold text-blue-800">Growth Opportunity</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Asia-Pacific shows 45% month-over-month growth potential
                        </p>
                      </div>
                      <div className="p-4 glass rounded-lg border-l-4 border-l-orange-500">
                        <h4 className="font-semibold text-orange-800">Emerging Markets</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Latin America and Africa present untapped opportunities
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
