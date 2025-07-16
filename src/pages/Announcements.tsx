import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search,
  Filter,
  MessageSquare,
  Pin,
  Eye,
  Clock,
  User,
  Bell,
  TrendingUp,
  BookOpen
} from "lucide-react";

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState("");

  const announcements = [
    {
      id: "1",
      title: "2024년 하반기 시스템 업그레이드 안내",
      content: "안녕하세요. 시스템 안정성 향상을 위한 하반기 업그레이드 일정을 안내드립니다. 업그레이드 기간 중 일부 서비스 중단이 있을 수 있으니 양해 부탁드립니다.",
      category: "시스템",
      priority: "높음",
      author: "김팀장",
      publishedAt: "2024-07-16",
      views: 156,
      isPinned: true,
      isRequired: true,
      readCount: 23,
      totalUsers: 45
    },
    {
      id: "2", 
      title: "보안 정책 변경 및 패스워드 갱신 요청",
      content: "정보보안 강화를 위한 새로운 보안 정책이 적용됩니다. 모든 직원은 새로운 패스워드 정책에 따라 비밀번호를 변경해주시기 바랍니다.",
      category: "보안",
      priority: "높음",
      author: "정보보안팀",
      publishedAt: "2024-07-15",
      views: 124,
      isPinned: true,
      isRequired: true,
      readCount: 18,
      totalUsers: 45
    },
    {
      id: "3",
      title: "신규 교육 프로그램 신청 안내",
      content: "직원 역량 강화를 위한 신규 교육 프로그램을 운영합니다. 관심 있는 분들은 기한 내에 신청해주시기 바랍니다.",
      category: "교육",
      priority: "중간",
      author: "인사팀",
      publishedAt: "2024-07-14",
      views: 89,
      isPinned: false,
      isRequired: false,
      readCount: 34,
      totalUsers: 45
    },
    {
      id: "4",
      title: "월례 회의 일정 변경 안내",
      content: "다음 주 월례 회의 일정이 변경되었습니다. 새로운 일정을 확인하시고 참석해주시기 바랍니다.",
      category: "일반",
      priority: "중간",
      author: "기획팀",
      publishedAt: "2024-07-13",
      views: 67,
      isPinned: false,
      isRequired: false,
      readCount: 28,
      totalUsers: 45
    },
    {
      id: "5",
      title: "여름 휴가 신청 마감일 안내",
      content: "여름 휴가 신청 마감일이 다가오고 있습니다. 아직 신청하지 않은 분들은 서둘러 신청해주시기 바랍니다.",
      category: "인사",
      priority: "낮음",
      author: "인사팀",
      publishedAt: "2024-07-12",
      views: 102,
      isPinned: false,
      isRequired: false,
      readCount: 41,
      totalUsers: 45
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "높음": return "bg-destructive text-destructive-foreground";
      case "중간": return "bg-warning text-warning-foreground";
      case "낮음": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "시스템": return "bg-primary text-primary-foreground";
      case "보안": return "bg-destructive text-destructive-foreground";
      case "교육": return "bg-success text-success-foreground";
      case "인사": return "bg-warning text-warning-foreground";
      case "일반": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
  const requiredAnnouncements = filteredAnnouncements.filter(a => a.isRequired);
  const unreadAnnouncements = filteredAnnouncements.filter(a => a.readCount < a.totalUsers);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">공지사항</h1>
          <p className="text-muted-foreground mt-1">중요한 소식과 업데이트를 확인하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            알림 설정
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 공지 작성
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 공지</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">필독 공지</p>
                <p className="text-2xl font-bold">{requiredAnnouncements.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">미읽은 공지</p>
                <p className="text-2xl font-bold">{unreadAnnouncements.length}</p>
              </div>
              <Eye className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">이번 주 공지</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="공지사항 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
              <Button variant="outline" size="sm">
                정렬
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Announcement Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            전체 ({filteredAnnouncements.length})
          </TabsTrigger>
          <TabsTrigger value="pinned">
            고정 ({pinnedAnnouncements.length})
          </TabsTrigger>
          <TabsTrigger value="required">
            필독 ({requiredAnnouncements.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            미읽음 ({unreadAnnouncements.length})
          </TabsTrigger>
        </TabsList>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Pin className="h-5 w-5" />
              고정된 공지사항
            </h3>
            <div className="space-y-3">
              {pinnedAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Pin className="h-4 w-4 text-primary" />
                          <Badge className={getPriorityColor(announcement.priority)}>
                            {announcement.priority}
                          </Badge>
                          <Badge className={getCategoryColor(announcement.category)}>
                            {announcement.category}
                          </Badge>
                          {announcement.isRequired && (
                            <Badge className="bg-destructive text-destructive-foreground">
                              필독
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {announcement.content}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{announcement.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{announcement.publishedAt}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{announcement.views}회 조회</span>
                        </div>
                      </div>
                      {announcement.isRequired && (
                        <div className="text-xs">
                          읽음: {announcement.readCount}/{announcement.totalUsers}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Announcement Lists */}
        <TabsContent value="all" className="space-y-4">
          <div className="space-y-3">
            {filteredAnnouncements.filter(a => !a.isPinned).map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        <Badge className={getCategoryColor(announcement.category)}>
                          {announcement.category}
                        </Badge>
                        {announcement.isRequired && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            필독
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {announcement.content}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{announcement.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{announcement.publishedAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{announcement.views}회 조회</span>
                      </div>
                    </div>
                    {announcement.isRequired && (
                      <div className="text-xs">
                        읽음: {announcement.readCount}/{announcement.totalUsers}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pinned" className="space-y-4">
          <div className="space-y-3">
            {pinnedAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Pin className="h-4 w-4 text-primary" />
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        <Badge className={getCategoryColor(announcement.category)}>
                          {announcement.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {announcement.content}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{announcement.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{announcement.publishedAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{announcement.views}회 조회</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="required" className="space-y-4">
          <div className="space-y-3">
            {requiredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-destructive text-destructive-foreground">
                          필독
                        </Badge>
                        <Badge className={getCategoryColor(announcement.category)}>
                          {announcement.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {announcement.content}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{announcement.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{announcement.publishedAt}</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      읽음: {announcement.readCount}/{announcement.totalUsers}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <div className="space-y-3">
            {unreadAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border-warning/20 bg-warning/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-warning text-warning-foreground">
                          미읽음
                        </Badge>
                        <Badge className={getCategoryColor(announcement.category)}>
                          {announcement.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {announcement.content}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{announcement.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{announcement.publishedAt}</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      읽음: {announcement.readCount}/{announcement.totalUsers}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}