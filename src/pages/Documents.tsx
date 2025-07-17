import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUploadDialog from "@/components/documents/FileUploadDialog";
import { 
  Upload, 
  Search,
  Filter,
  FolderOpen,
  FileText,
  Image,
  Archive,
  Download,
  Eye,
  Share,
  Star,
  Clock,
  User,
  MoreHorizontal
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileItem, UploadedFile } from "@/types";
import { useDocuments } from "@/hooks/useSupabase";
import { Loader2 } from "lucide-react";

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { documents, loading, uploadDocument, deleteDocument } = useDocuments();

  // 기존 하드코딩된 데이터는 제거하고 Supabase에서 가져온 데이터 사용
  const [localFiles] = useState([
    {
      id: "f1",
      name: "2024년 상반기 운영 보고서.pdf",
      type: "pdf",
      size: "2.4 MB",
      lastModified: "2024-07-16",
      modifiedBy: "김팀장",
      tags: ["보고서", "운영"],
      isStarred: true,
      icon: FileText
    },
    {
      id: "f2",
      name: "신규 시스템 구축 계획서.docx",
      type: "doc",
      size: "1.2 MB", 
      lastModified: "2024-07-15",
      modifiedBy: "이개발",
      tags: ["계획서", "시스템"],
      isStarred: false,
      icon: FileText
    },
    {
      id: "f3",
      name: "UI 디자인 가이드라인.png",
      type: "image",
      size: "856 KB",
      lastModified: "2024-07-14",
      modifiedBy: "박디자인",
      tags: ["디자인", "가이드"],
      isStarred: true,
      icon: Image
    },
    {
      id: "f4",
      name: "백업 데이터_2024-07.zip",
      type: "archive",
      size: "45.2 MB",
      lastModified: "2024-07-13",
      modifiedBy: "정DBA",
      tags: ["백업", "데이터"],
      isStarred: false,
      icon: Archive
    }
  ]);

  const folders = [
    {
      id: "1",
      name: "회의 자료",
      type: "folder",
      itemCount: 24,
      lastModified: "2024-07-16",
      icon: FolderOpen
    },
    {
      id: "2", 
      name: "정책 문서",
      type: "folder",
      itemCount: 12,
      lastModified: "2024-07-15",
      icon: FolderOpen
    },
    {
      id: "3",
      name: "교육 자료",
      type: "folder", 
      itemCount: 35,
      lastModified: "2024-07-14",
      icon: FolderOpen
    }
  ];

  const handleFileUpload = (newFiles: UploadedFile[]) => {
    // Supabase 훅의 uploadDocument 함수 사용
    newFiles.forEach(file => {
      uploadDocument({
        name: file.name,
        type: file.type,
        size: file.size,
        uploaded_by: file.uploadedBy,
        path: `/documents/${file.name}`
      });
    });
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "pdf": return "bg-destructive/10 text-destructive";
      case "doc": return "bg-primary/10 text-primary";
      case "image": return "bg-success/10 text-success";
      case "archive": return "bg-warning/10 text-warning";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  // Supabase 데이터와 로컬 데이터 합치기 (개발 단계)
  const allFiles = [...documents, ...localFiles];
  const allItems = [...folders, ...allFiles];
  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentItems = allFiles.slice(0, 3);
  const starredItems = allFiles.filter(file => file.isStarred);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">문서를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">문서 저장소</h1>
          <p className="text-muted-foreground mt-1">파일과 문서를 체계적으로 관리하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderOpen className="h-4 w-4 mr-2" />
            새 폴더
          </Button>
          <FileUploadDialog onFileUpload={handleFileUpload} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 파일</p>
                <p className="text-2xl font-bold">248</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">사용 용량</p>
                <p className="text-2xl font-bold">12.4GB</p>
              </div>
              <Archive className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">즐겨찾기</p>
                <p className="text-2xl font-bold">{starredItems.length}</p>
              </div>
              <Star className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">공유 중</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <Share className="h-8 w-8 text-info" />
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
                placeholder="파일명으로 검색..."
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

      {/* Document Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">전체 파일</TabsTrigger>
          <TabsTrigger value="recent">최근 파일</TabsTrigger>
          <TabsTrigger value="starred">즐겨찾기</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Folders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {folders.map((folder) => (
              <Card key={folder.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <folder.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{folder.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {folder.itemCount}개 항목 • {folder.lastModified}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Files */}
          <div className="space-y-2">
            {filteredItems.filter(item => item.type !== "folder").map((file: FileItem) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(file.type)}`}>
                      <file.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{file.name}</h4>
                        {(file.is_starred || file.isStarred) && <Star className="h-4 w-4 text-warning fill-current" />}
                        <div className="flex gap-1">
                          {(file.tags || []).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{file.size}</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {file.modified_by || file.modifiedBy || file.uploaded_by || file.uploadedBy || '미지정'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {file.last_modified || file.lastModified || file.created_at || file.uploadedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-2">
            {recentItems.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(file.type)}`}>
                      <file.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{file.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {file.size} • {file.modifiedBy} • {file.lastModified}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="starred" className="space-y-4">
          <div className="space-y-2">
            {starredItems.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(file.type)}`}>
                      <file.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{file.name}</h4>
                        <Star className="h-4 w-4 text-warning fill-current" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {file.size} • {file.modifiedBy} • {file.lastModified}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
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