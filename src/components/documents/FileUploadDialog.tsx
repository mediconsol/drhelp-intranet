import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  Archive, 
  File,
  FolderOpen,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FileUploadDialogProps {
  onFileUpload?: (files: any[]) => void;
}

export default function FileUploadDialog({ onFileUpload }: FileUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    folder: "",
    description: "",
    tags: [] as string[],
    currentTag: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const folders = [
    { value: "meetings", label: "회의 자료" },
    { value: "policies", label: "정책 문서" },
    { value: "education", label: "교육 자료" },
    { value: "reports", label: "보고서" },
    { value: "others", label: "기타" },
  ];

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf')) return FileText;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    return File;
  };

  const getFileTypeColor = (type: string) => {
    if (type.startsWith('image/')) return "text-success";
    if (type.includes('pdf')) return "text-destructive";
    if (type.includes('zip') || type.includes('rar')) return "text-warning";
    return "text-muted-foreground";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.currentTag.trim()],
        currentTag: "",
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "파일을 선택해주세요",
        description: "업로드할 파일을 먼저 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // 실제로는 API 호출
      for (let i = 0; i < selectedFiles.length; i++) {
        // 업로드 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500));
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      const uploadedFiles = selectedFiles.map((file, index) => ({
        id: `f${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        lastModified: new Date().toISOString().split('T')[0],
        modifiedBy: "현재사용자",
        tags: formData.tags,
        folder: formData.folder,
        description: formData.description,
        isStarred: false,
        icon: getFileIcon(file.type),
      }));

      onFileUpload?.(uploadedFiles);

      toast({
        title: "파일 업로드 완료",
        description: `${selectedFiles.length}개 파일이 성공적으로 업로드되었습니다.`,
      });

      // 초기화
      setOpen(false);
      setSelectedFiles([]);
      setFormData({
        folder: "",
        description: "",
        tags: [],
        currentTag: "",
      });
      setUploadProgress(0);

    } catch (error) {
      toast({
        title: "업로드 실패",
        description: "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          파일 업로드
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            파일 업로드
          </DialogTitle>
          <DialogDescription>
            문서와 파일을 저장소에 업로드하세요. 드래그 앤 드롭으로도 업로드할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors",
              "hover:border-primary hover:bg-primary/5"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">파일을 여기에 드롭하거나</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              파일 선택
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <p className="text-sm text-muted-foreground mt-2">
              최대 5GB까지 업로드 가능 • PDF, DOC, 이미지, 압축파일 지원
            </p>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <Label>선택된 파일 ({selectedFiles.length}개)</Label>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <FileIcon className={cn("h-5 w-5", getFileTypeColor(file.type))} />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            disabled={uploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>업로드 진행률</Label>
                <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>저장 폴더</Label>
              <Select
                value={formData.folder}
                onValueChange={(value) => setFormData({ ...formData, folder: value })}
                disabled={uploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="폴더 선택 (선택사항)" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.value} value={folder.value}>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4" />
                        {folder.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>태그 추가</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.currentTag}
                  onChange={(e) => setFormData({ ...formData, currentTag: e.target.value })}
                  placeholder="태그명 입력"
                  disabled={uploading}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button variant="outline" size="sm" onClick={addTag} disabled={uploading}>
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tags */}
          {formData.tags.length > 0 && (
            <div className="space-y-2">
              <Label>태그</Label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => removeTag(tag)}
                      disabled={uploading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label>설명 (선택사항)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="파일에 대한 설명을 입력하세요..."
              disabled={uploading}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              취소
            </Button>
            <Button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0}>
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  파일 업로드
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}