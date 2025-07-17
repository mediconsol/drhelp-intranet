import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// date-fns 제거됨 - JavaScript 내장 메서드 사용
import { CalendarIcon, FileText, Download, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ReportGenerationDialogProps {
  trigger?: React.ReactNode;
}

export default function ReportGenerationDialog({ trigger }: ReportGenerationDialogProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    // includeTickets: true, // 제거됨
    includeDocuments: false,
    includeCalendar: false,
    includeAnnouncements: false,
    format: "pdf",
  });
  const { toast } = useToast();

  const reportTypes = [
    { value: "weekly", label: "주간 업무 보고서" },
    { value: "monthly", label: "월간 진행 현황" },
    { value: "quarterly", label: "분기별 성과 분석" },
    { value: "project", label: "프로젝트 진행 보고서" },
    { value: "custom", label: "사용자 정의 보고서" },
  ];

  const formats = [
    { value: "pdf", label: "PDF" },
    { value: "excel", label: "Excel" },
    { value: "word", label: "Word" },
  ];

  const handleGenerate = async () => {
    if (!formData.title || !formData.type || !formData.startDate || !formData.endDate) {
      toast({
        title: "필수 항목을 입력해주세요",
        description: "보고서 제목, 유형, 기간을 모두 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (formData.startDate >= formData.endDate) {
      toast({
        title: "날짜 오류",
        description: "종료일은 시작일보다 이후여야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 3000));

      const reportData = {
        title: formData.title,
        type: formData.type,
        period: `${formData.startDate.toISOString().split('T')[0]} ~ ${formData.endDate.toISOString().split('T')[0]}`,
        includes: {
          // tickets: formData.includeTickets, // 제거됨
          documents: formData.includeDocuments,
          calendar: formData.includeCalendar,
          announcements: formData.includeAnnouncements,
        },
        format: formData.format,
        generatedAt: new Date().toISOString(),
      };

      console.log("Generated report:", reportData);

      toast({
        title: "보고서 생성 완료",
        description: `${formData.title} 보고서가 성공적으로 생성되었습니다.`,
      });

      setOpen(false);
      setFormData({
        title: "",
        type: "",
        startDate: undefined,
        endDate: undefined,
        // includeTickets: true, // 제거됨
        includeDocuments: false,
        includeCalendar: false,
        includeAnnouncements: false,
        format: "pdf",
      });

    } catch (error) {
      toast({
        title: "보고서 생성 실패",
        description: "보고서 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            보고서 생성
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            보고서 생성
          </DialogTitle>
          <DialogDescription>
            업무 현황과 진행 상황을 정리한 보고서를 생성합니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">보고서 제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: 2024년 7월 주간 업무 보고서"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>보고서 유형 *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="보고서 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>시작일 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      formData.startDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    ) : (
                      <span>시작일 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>종료일 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      formData.endDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    ) : (
                      <span>종료일 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    disabled={(date) => formData.startDate ? date < formData.startDate : false}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-3">
            <Label>포함할 데이터</Label>
            <div className="space-y-3">
              {/* 티켓 체크박스 제거됨 */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="documents" 
                  checked={formData.includeDocuments}
                  onCheckedChange={(checked) => setFormData({ ...formData, includeDocuments: !!checked })}
                />
                <Label htmlFor="documents" className="text-sm font-normal">문서 활동 내역</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="calendar" 
                  checked={formData.includeCalendar}
                  onCheckedChange={(checked) => setFormData({ ...formData, includeCalendar: !!checked })}
                />
                <Label htmlFor="calendar" className="text-sm font-normal">일정 및 회의 내역</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="announcements" 
                  checked={formData.includeAnnouncements}
                  onCheckedChange={(checked) => setFormData({ ...formData, includeAnnouncements: !!checked })}
                />
                <Label htmlFor="announcements" className="text-sm font-normal">공지사항 및 게시판</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>출력 형식</Label>
            <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
              <SelectTrigger>
                <SelectValue placeholder="출력 형식 선택" />
              </SelectTrigger>
              <SelectContent>
                {formats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={generating}>
              취소
            </Button>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  생성 중...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  보고서 생성
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}