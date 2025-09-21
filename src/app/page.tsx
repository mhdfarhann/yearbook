'use client';
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Users, Image, User, Calendar, Home, Target } from 'lucide-react';

// Template image path tetap
const TEMPLATE_IMAGE = "/images/template.png";

// Types
interface StudentData {
  id: number;
  name: string;
  birthPlace: string;
  birthDate: string;
  address: string;
  dream: string;
  photo: string;
  submitTime: string;
}

interface DataSlot {
  id: number;
  type: 'photo' | 'name' | 'birthPlace' | 'birthDate' | 'address' | 'dream';
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
}

const YearbookSecure: React.FC = () => {
  // State
  const [studentsData, setStudentsData] = useState<StudentData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // State untuk positioning mode (khusus admin)
  const [isPositioningMode, setIsPositioningMode] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');

  // Password sederhana untuk admin mode
  const ADMIN_PASSWORD = 'admin123';
  
  // State untuk form input siswa
  const [studentForm, setStudentForm] = useState({
    name: '',
    birthPlace: '',
    birthDate: '',
    address: '',
    dream: '',
    photo: null as string | null
  });

  // Refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Konfigurasi: 5 siswa per halaman sesuai template
  const STUDENTS_PER_PAGE = 5;

  // Update slot position dan size
  const updateSlotPosition = useCallback((slotId: number, x: number, y: number) => {
    setTemplateSlots(prev => 
      prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, x: Math.max(0, x), y: Math.max(0, y) }
          : slot
      )
    );
  }, []);

  const updateSlotSize = useCallback((slotId: number, width: number, height: number) => {
    setTemplateSlots(prev => 
      prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, width: Math.max(10, width), height: Math.max(10, height) }
          : slot
      )
    );
  }, []);

  const updateSlotFontSize = useCallback((slotId: number, fontSize: number) => {
    setTemplateSlots(prev => 
      prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, fontSize: Math.max(14, Math.min(60, fontSize)) }
          : slot
      )
    );
  }, []);

  // State untuk mutable template slots - foto 324x324px dan font 40px
  const [templateSlots, setTemplateSlots] = useState<DataSlot[]>([
    // Siswa 1 - foto 324x324 px, font 40px
    { id: 1, type: 'photo', x: 18, y: 120, width: 324, height: 324 },
    { id: 2, type: 'name', x: 530, y: 132, width: 400, height: 50, fontSize: 40, color: '#000', fontWeight: 'bold' },
    { id: 3, type: 'birthPlace', x: 534, y: 192, width: 200, height: 45, fontSize: 40, color: '#000' },
    { id: 4, type: 'birthDate', x: 754, y: 184, width: 180, height: 45, fontSize: 40, color: '#000' },
    { id: 5, type: 'address', x: 533, y: 244, width: 350, height: 45, fontSize: 40, color: '#000' },
    { id: 6, type: 'dream', x: 529, y: 292, width: 350, height: 45, fontSize: 40, color: '#000' },
    
    // Siswa 2 - foto 324x324 px, font 40px
    { id: 7, type: 'photo', x: 74, y: 532, width: 324, height: 324 },
    { id: 8, type: 'name', x: 534, y: 540, width: 400, height: 50, fontSize: 40, color: '#000', fontWeight: 'bold' },
    { id: 9, type: 'birthPlace', x: 537, y: 612, width: 200, height: 45, fontSize: 40, color: '#000' },
    { id: 10, type: 'birthDate', x: 754, y: 612, width: 180, height: 45, fontSize: 40, color: '#000' },
    { id: 11, type: 'address', x: 537, y: 664, width: 350, height: 45, fontSize: 40, color: '#000' },
    { id: 12, type: 'dream', x: 536, y: 720, width: 350, height: 45, fontSize: 40, color: '#000' },
    
    // Siswa 3 - foto 324x324 px, font 40px
    { id: 13, type: 'photo', x: 70, y: 892, width: 324, height: 324 },
    { id: 14, type: 'name', x: 530, y: 872, width: 400, height: 50, fontSize: 40, color: '#000', fontWeight: 'bold' },
    { id: 15, type: 'birthPlace', x: 534, y: 932, width: 200, height: 45, fontSize: 40, color: '#000' },
    { id: 16, type: 'birthDate', x: 750, y: 936, width: 180, height: 45, fontSize: 40, color: '#000' },
    { id: 17, type: 'address', x: 537, y: 992, width: 350, height: 45, fontSize: 40, color: '#000' },
    { id: 18, type: 'dream', x: 537, y: 1052, width: 350, height: 45, fontSize: 40, color: '#000' },
    
    // Siswa 4 - foto 324x324 px, font 40px
    { id: 19, type: 'photo', x: 74, y: 1252, width: 324, height: 324 },
    { id: 20, type: 'name', x: 526, y: 1252, width: 400, height: 50, fontSize: 40, color: '#000', fontWeight: 'bold' },
    { id: 21, type: 'birthPlace', x: 534, y: 1312, width: 200, height: 45, fontSize: 40, color: '#000' },
    { id: 22, type: 'birthDate', x: 754, y: 1312, width: 180, height: 45, fontSize: 40, color: '#000' },
    { id: 23, type: 'address', x: 540, y: 1372, width: 350, height: 45, fontSize: 40, color: '#000' },
    { id: 24, type: 'dream', x: 537, y: 1424, width: 350, height: 45, fontSize: 40, color: '#000' },
    
    // Siswa 5 - foto 324x324 px, font 40px
    { id: 25, type: 'photo', x: 82, y: 1632, width: 324, height: 324 },
    { id: 26, type: 'name', x: 522, y: 1612, width: 400, height: 50, fontSize: 40, color: '#000', fontWeight: 'bold' },
    { id: 27, type: 'birthPlace', x: 530, y: 1668, width: 200, height: 45, fontSize: 40, color: '#000' },
    { id: 28, type: 'birthDate', x: 754, y: 1668, width: 180, height: 45, fontSize: 40, color: '#000' },
    { id: 29, type: 'address', x: 536, y: 1724, width: 350, height: 45, fontSize: 40, color: '#000' },
    { id: 30, type: 'dream', x: 528, y: 1788, width: 350, height: 45, fontSize: 40, color: '#000' },
  ]);

  // Hitung total halaman
  const totalPages = Math.max(1, Math.ceil(studentsData.length / STUDENTS_PER_PAGE));

  // Get students untuk halaman saat ini
  const getCurrentPageStudents = (): StudentData[] => {
    const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
    const endIndex = startIndex + STUDENTS_PER_PAGE;
    return studentsData.slice(startIndex, endIndex);
  };

  // Handle upload foto untuk form
  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result && typeof e.target.result === 'string') {
          setStudentForm(prev => ({
            ...prev,
            photo: e.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Tambah data siswa
  const addStudentData = useCallback(() => {
    const { name, birthPlace, birthDate, address, dream, photo } = studentForm;
    
    if (!name || !birthPlace || !birthDate || !address || !dream || !photo) {
      alert('Mohon lengkapi semua data terlebih dahulu!');
      return;
    }

    const newStudent: StudentData = {
      id: Date.now() + Math.random(),
      name: name.trim(),
      birthPlace: birthPlace.trim(),
      birthDate,
      address: address.trim(),
      dream: dream.trim(),
      photo,
      submitTime: new Date().toLocaleString()
    };

    setStudentsData(prev => [...prev, newStudent]);
    
    // Reset form
    setStudentForm({
      name: '',
      birthPlace: '',
      birthDate: '',
      address: '',
      dream: '',
      photo: null
    });

    // Reset file input
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }

    alert('Data berhasil ditambahkan ke buku tahunan!');
  }, [studentForm]);

  // Component untuk Draggable Element dengan Resize
  interface DraggableElementProps {
    slot: DataSlot;
    student?: StudentData;
    isPositioning: boolean;
    onPositionChange: (slotId: number, x: number, y: number) => void;
    onSizeChange?: (slotId: number, width: number, height: number) => void;
    onFontSizeChange?: (slotId: number, fontSize: number) => void;
  }

  const DraggableElement: React.FC<DraggableElementProps> = ({ 
    slot, 
    student, 
    isPositioning, 
    onPositionChange,
    onSizeChange,
    onFontSizeChange
  }) => {
    const [isResizing, setIsResizing] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!isPositioning || isResizing) return;
      
      e.preventDefault();
      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
      if (!rect) return;
      
      const img = e.currentTarget.parentElement?.querySelector('img');
      if (!img) return;
      
      const imgRect = img.getBoundingClientRect();
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;
      
      const startX = (e.clientX - imgRect.left) * scaleX - slot.x;
      const startY = (e.clientY - imgRect.top) * scaleY - slot.y;
      
      const handleMouseMove = (e: MouseEvent) => {
        const newX = Math.max(0, (e.clientX - imgRect.left) * scaleX - startX);
        const newY = Math.max(0, (e.clientY - imgRect.top) * scaleY - startY);
        onPositionChange(slot.id, Math.round(newX), Math.round(newY));
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }, [isPositioning, slot.id, slot.x, slot.y, onPositionChange, isResizing]);

    // Handle resize drag
    const handleResizeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!isPositioning) return;
      
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      
      const img = e.currentTarget.closest('.relative')?.querySelector('img');
      if (!img) return;
      
      const imgRect = img.getBoundingClientRect();
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = slot.width;
      const startHeight = slot.height;
      
      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = (e.clientX - startX) * scaleX;
        const deltaY = (e.clientY - startY) * scaleY;
        
        // Minimum dan maximum size disesuaikan dengan template 1333x2000px
        const minSize = slot.type === 'photo' ? 100 : 150;
        const maxSize = slot.type === 'photo' ? 500 : 800;
        
        const newWidth = Math.max(minSize, Math.min(maxSize, startWidth + deltaX));
        const newHeight = Math.max(minSize, Math.min(maxSize, startHeight + deltaY));
        
        if (onSizeChange) {
          onSizeChange(slot.id, Math.round(newWidth), Math.round(newHeight));
        }
      };
      
      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }, [isPositioning, slot.id, slot.width, slot.height, slot.type, onSizeChange]);

    const getSlotContent = () => {
      if (!student) {
        return `[${slot.type.toUpperCase()}]`;
      }
      
      switch (slot.type) {
        case 'photo':
          return null;
        case 'name':
          return student.name;
        case 'birthPlace':
          return student.birthPlace;
        case 'birthDate':
          return new Date(student.birthDate).toLocaleDateString('id-ID');
        case 'address':
          return student.address.length > 30 ? student.address.substring(0, 27) + '...' : student.address;
        case 'dream':
          return student.dream.length > 30 ? student.dream.substring(0, 27) + '...' : student.dream;
        default:
          return `[${slot.type}]`;
      }
    };

    // Calculate scaled position for display
    const img = document.querySelector('img[alt="Template Buku Tahunan"]') as HTMLImageElement;
    if (!img) return null;
    
    const imgRect = img.getBoundingClientRect();
    const scaleX = imgRect.width / (img.naturalWidth || 1);
    const scaleY = imgRect.height / (img.naturalHeight || 1);
    
    const displayX = slot.x * scaleX;
    const displayY = slot.y * scaleY;
    const displayWidth = slot.width * scaleX;
    const displayHeight = slot.height * scaleY;

    return (
      <div
        className={`absolute ${
          isPositioning 
            ? 'border-2 border-red-500 cursor-move bg-red-100/30 hover:bg-red-200/30' 
            : ''
        }`}
        style={{
          left: `${displayX}px`,
          top: `${displayY}px`,
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => isPositioning && setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {slot.type === 'photo' ? (
          <div className="w-full h-full relative">
            {student ? (
              <img 
                src={student.photo} 
                alt={`Foto ${student.name}`}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs">
                FOTO
              </div>
            )}
          </div>
        ) : (
          <div 
            className="w-full h-full flex items-start justify-start" 
            style={{ 
              color: slot.color || '#000',
              fontWeight: slot.fontWeight || 'normal',
              fontSize: `${(slot.fontSize || 12) * Math.min(scaleX, scaleY)}px`,
              lineHeight: '1',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {getSlotContent()}
          </div>
        )}
        
        {/* Resize Handle */}
        {isPositioning && (
          <>
            {/* Resize corner */}
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize hover:bg-blue-600 border-2 border-white shadow-lg"
              onMouseDown={handleResizeMouseDown}
              title="Drag untuk resize"
            />
            
            {/* Additional resize handles untuk foto */}
            {slot.type === 'photo' && (
              <>
                {/* Top resize handle */}
                <div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full cursor-n-resize hover:bg-green-600 border border-white"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const startY = e.clientY;
                    const startHeight = slot.height;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const deltaY = startY - e.clientY;
                      const newHeight = Math.max(100, Math.min(500, startHeight + deltaY));
                      if (onSizeChange) {
                        onSizeChange(slot.id, slot.width, Math.round(newHeight));
                      }
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                  title="Drag untuk resize tinggi"
                />
                
                {/* Left resize handle */}
                <div
                  className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full cursor-w-resize hover:bg-green-600 border border-white"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const startX = e.clientX;
                    const startWidth = slot.width;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const deltaX = startX - e.clientX;
                      const newWidth = Math.max(100, Math.min(500, startWidth + deltaX));
                      if (onSizeChange) {
                        onSizeChange(slot.id, Math.round(newWidth), slot.height);
                      }
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                  title="Drag untuk resize lebar"
                />
              </>
            )}
            
            {/* Font size controls untuk text */}
            {showControls && slot.type !== 'photo' && onFontSizeChange && (
              <div className="absolute -top-12 left-0 bg-black/90 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2 shadow-lg">
                <button
                  onClick={() => onFontSizeChange(slot.id, (slot.fontSize || 22) - 2)}
                  className="w-6 h-6 bg-red-500 rounded-full text-xs hover:bg-red-600 flex items-center justify-center font-bold"
                  title="Kurangi font size"
                >
                  -
                </button>
                <span className="px-2 font-mono text-xs">{slot.fontSize || 22}px</span>
                <button
                  onClick={() => onFontSizeChange(slot.id, (slot.fontSize || 22) + 2)}
                  className="w-6 h-6 bg-green-500 rounded-full text-xs hover:bg-green-600 flex items-center justify-center font-bold"
                  title="Tambah font size"
                >
                  +
                </button>
              </div>
            )}
            
            {/* Size controls untuk foto */}
            {showControls && slot.type === 'photo' && onSizeChange && (
              <div className="absolute -top-12 left-0 bg-black/90 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2 shadow-lg">
                <button
                  onClick={() => {
                    const newSize = Math.max(100, Math.min(slot.width, slot.height) - 25);
                    onSizeChange(slot.id, newSize, newSize);
                  }}
                  className="w-6 h-6 bg-red-500 rounded-full text-xs hover:bg-red-600 flex items-center justify-center font-bold"
                  title="Kecilkan foto"
                >
                  -
                </button>
                <span className="px-2 font-mono text-xs">{Math.min(slot.width, slot.height)}px</span>
                <button
                  onClick={() => {
                    const newSize = Math.min(500, Math.max(slot.width, slot.height) + 25);
                    onSizeChange(slot.id, newSize, newSize);
                  }}
                  className="w-6 h-6 bg-green-500 rounded-full text-xs hover:bg-green-600 flex items-center justify-center font-bold"
                  title="Besarkan foto"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    // Reset ke ukuran default sesuai template resolusi tinggi
                    const defaultSize = 180;
                    onSizeChange(slot.id, defaultSize, defaultSize);
                  }}
                  className="px-2 py-1 bg-blue-500 rounded text-xs hover:bg-blue-600"
                  title="Reset ukuran"
                >
                  Reset
                </button>
              </div>
            )}
            
            {/* Position info dengan size info */}
            {showControls && (
              <div className="absolute -top-6 -right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
                {slot.x},{slot.y} ({slot.width}x{slot.height})
              </div>
            )}
          </>
        )}
      </div>
    );
  };
  
  const downloadCompositeImage = useCallback(async () => {
    if (studentsData.length === 0) {
      alert('Belum ada data siswa untuk didownload!');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    try {
      const templateImg = new window.Image();
      templateImg.crossOrigin = 'anonymous';
      
      templateImg.onload = async () => {
        canvas.width = templateImg.width;
        canvas.height = templateImg.height;
        
        // Draw background template
        ctx.drawImage(templateImg, 0, 0);
        
        const currentStudents = getCurrentPageStudents();
        
        // Draw data untuk setiap siswa
        for (let studentIndex = 0; studentIndex < currentStudents.length; studentIndex++) {
          const student = currentStudents[studentIndex];
          const baseSlotIndex = studentIndex * 6; // 6 slot per siswa (foto + 5 data)
          
          // Draw foto
          const photoSlot = templateSlots[baseSlotIndex];
          if (photoSlot && photoSlot.type === 'photo') {
            const studentImg = new window.Image();
            await new Promise<void>((resolve) => {
              studentImg.onload = () => {
                ctx.save();
                
                // Create circular clipping untuk foto
                const centerX = photoSlot.x + photoSlot.width / 2;
                const centerY = photoSlot.y + photoSlot.height / 2;
                const radius = Math.min(photoSlot.width, photoSlot.height) / 2;
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.clip();
                
                // Scale untuk cover circle
                const scale = Math.max(
                  photoSlot.width / studentImg.width,
                  photoSlot.height / studentImg.height
                );
                
                const scaledWidth = studentImg.width * scale;
                const scaledHeight = studentImg.height * scale;
                const offsetX = (photoSlot.width - scaledWidth) / 2;
                const offsetY = (photoSlot.height - scaledHeight) / 2;
                
                ctx.drawImage(
                  studentImg,
                  photoSlot.x + offsetX,
                  photoSlot.y + offsetY,
                  scaledWidth,
                  scaledHeight
                );
                
                ctx.restore();
                resolve();
              };
              studentImg.src = student.photo;
            });
          }
          
          // Draw text data tanpa label
          const textSlots = templateSlots.slice(baseSlotIndex + 1, baseSlotIndex + 6);
          textSlots.forEach((slot, index) => {
            if (!slot) return;
            
            let text = '';
            switch (slot.type) {
              case 'name':
                text = student.name;
                break;
              case 'birthPlace':
                text = student.birthPlace;
                break;
              case 'birthDate':
                text = new Date(student.birthDate).toLocaleDateString('id-ID');
                break;
              case 'address':
                text = student.address;
                break;
              case 'dream':
                text = student.dream;
                break;
            }
            
            // Batasi panjang teks berdasarkan ukuran yang lebih besar
            if (text.length > 40) {
              text = text.substring(0, 37) + '...';
            }
            
            // Set font properties - sama persis dengan preview, default 40px
            ctx.font = `${slot.fontWeight || 'normal'} ${slot.fontSize || 40}px Arial, sans-serif`;
            ctx.fillStyle = slot.color || '#000';
            ctx.textBaseline = 'top';
            
            // Draw text dengan positioning yang sama seperti preview
            ctx.fillText(text, slot.x, slot.y);
          });
        }
        
        // Download hasil
        const link = document.createElement('a');
        link.download = `buku-tahunan-halaman-${currentPage}.png`;
        link.href = canvas.toDataURL('image/png', 0.95);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
      // Load template image
      templateImg.src = TEMPLATE_IMAGE;
      
    } catch (error) {
      console.error('Error creating composite:', error);
      alert('Terjadi kesalahan saat membuat gambar. Silakan coba lagi.');
    }
  }, [studentsData, currentPage, templateSlots]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Buku Tahunan SMP - Form Pendaftaran Siswa
            </h1>
            <p className="text-gray-600">
              Isi data diri lengkap dengan foto terbaik untuk masuk ke buku tahunan
            </p>
            
            <div className="flex justify-center items-center gap-6 mt-4">
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <Users size={20} />
                  <span className="font-semibold">{studentsData.length} Siswa Terdaftar</span>
                </div>
              </div>
              
              {studentsData.length > 0 && (
                <div className="bg-green-100 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="font-semibold">{totalPages} Halaman Siap</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form Input Siswa */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={24} />
                Form Data Siswa
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm(prev => ({...prev, name: e.target.value}))}
                    placeholder="Contoh: Siti Aminah"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    maxLength={30}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      value={studentForm.birthPlace}
                      onChange={(e) => setStudentForm(prev => ({...prev, birthPlace: e.target.value}))}
                      placeholder="Jakarta"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                      maxLength={20}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Calendar size={14} />
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={studentForm.birthDate}
                      onChange={(e) => setStudentForm(prev => ({...prev, birthDate: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Home size={16} />
                    Alamat
                  </label>
                  <textarea
                    value={studentForm.address}
                    onChange={(e) => setStudentForm(prev => ({...prev, address: e.target.value}))}
                    placeholder="Jl. Merdeka No. 123, Jakarta"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-400"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Target size={16} />
                    Cita-cita
                  </label>
                  <input
                    type="text"
                    value={studentForm.dream}
                    onChange={(e) => setStudentForm(prev => ({...prev, dream: e.target.value}))}
                    placeholder="Dokter"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    maxLength={25}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Image size={16} />
                    Foto Terbaik
                  </label>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {studentForm.photo && (
                    <div className="mt-3 text-center">
                      <img 
                        src={studentForm.photo} 
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-full border-4 border-blue-200 mx-auto"
                      />
                      <p className="text-xs text-green-600 mt-1">Foto siap digunakan</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  onClick={addStudentData}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-lg"
                >
                  <Upload size={24} />
                  Daftar ke Buku Tahunan
                </button>
              </div>
            </div>

            {/* Download Section - Khusus Admin */}
            {studentsData.length > 0 && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <h3 className="font-semibold text-yellow-800 mb-4">Panel Download (Admin)</h3>
                
                {/* Admin Login */}
                {!isAdminMode && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-yellow-700 mb-2">
                      Password Admin untuk Mode Positioning:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Masukkan password admin"
                        className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900"
                      />
                      <button
                        onClick={() => {
                          if (adminPassword === ADMIN_PASSWORD) {
                            setIsAdminMode(true);
                            alert('Mode admin aktif! Sekarang bisa atur positioning.');
                          } else {
                            alert('Password salah!');
                          }
                        }}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                      >
                        Login
                      </button>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">Password: admin123</p>
                  </div>
                )}

                {/* Admin Controls */}
                {isAdminMode && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium mb-2">Mode Admin Aktif</p>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setIsPositioningMode(!isPositioningMode)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          isPositioningMode 
                            ? 'bg-red-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {isPositioningMode ? 'Selesai Positioning' : 'Mode Positioning'}
                      </button>
                      
                      <button
                        onClick={() => {
                          let coordText = 'const templateSlots = [\n';
                          templateSlots.forEach((slot, i) => {
                            if (i % 6 === 0) coordText += `  // Siswa ${Math.floor(i/6) + 1}\n`;
                            coordText += `  { id: ${slot.id}, type: '${slot.type}', x: ${slot.x}, y: ${slot.y}, width: ${slot.width}, height: ${slot.height}${slot.fontSize ? `, fontSize: ${slot.fontSize}` : ''}${slot.color ? `, color: '${slot.color}'` : ''}${slot.fontWeight ? `, fontWeight: '${slot.fontWeight}'` : ''} },\n`;
                          });
                          coordText += '];';
                          
                          navigator.clipboard.writeText(coordText).then(() => {
                            alert('Koordinat berhasil dicopy ke clipboard!');
                          }).catch(() => {
                            // Fallback jika clipboard gagal
                            const textarea = document.createElement('textarea');
                            textarea.value = coordText;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            alert('Koordinat berhasil dicopy ke clipboard!');
                          });
                          
                          // Tetap log ke console juga
                          console.log('Current coordinates:');
                          console.log(coordText);
                        }}
                        className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
                      >
                        Copy Coordinates
                      </button>
                    </div>
                    
                    {isPositioningMode && (
                      <div className="text-sm text-green-700 bg-green-100 p-2 rounded">
                        <strong>Mode Positioning Aktif:</strong> 
                        <br />• Drag elemen untuk pindah posisi
                        <br />• Drag handle biru (sudut) untuk resize bebas
                        <br />• Drag handle hijau untuk resize spesifik (foto)
                        <br />• Hover untuk kontrol ukuran dan font
                        <br />• Klik tombol +/- untuk adjust size
                      </div>
                    )}
                  </div>
                )}
                
                {totalPages > 1 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-yellow-700">
                        Halaman {currentPage} dari {totalPages}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="flex-1 px-3 py-2 bg-yellow-200 hover:bg-yellow-300 disabled:bg-yellow-100 disabled:text-yellow-400 text-yellow-800 font-medium rounded-lg transition-colors"
                      >
                        ← Prev
                      </button>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="flex-1 px-3 py-2 bg-yellow-200 hover:bg-yellow-300 disabled:bg-yellow-100 disabled:text-yellow-400 text-yellow-800 font-medium rounded-lg transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={downloadCompositeImage}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Halaman {currentPage}
                </button>
              </div>
            )}
          </div>

          {/* Preview & Student List */}
          <div>
            {/* Template Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Preview Template
              </h3>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={TEMPLATE_IMAGE}
                    alt="Template Buku Tahunan"
                    className="max-w-full h-auto rounded-lg border-4 border-gray-300 shadow-lg"
                    style={{ maxHeight: '500px' }}
                  />
                  
                  {/* Overlay Elements untuk Positioning */}
                  {getCurrentPageStudents().map((student, studentIndex) => {
                    const baseSlotIndex = studentIndex * 6;
                    const studentSlots = templateSlots.slice(baseSlotIndex, baseSlotIndex + 6);
                    
                    return studentSlots.map((slot) => (
                      <DraggableElement
                        key={slot.id}
                        slot={slot}
                        student={student}
                        isPositioning={isPositioningMode}
                        onPositionChange={updateSlotPosition}
                        onSizeChange={updateSlotSize}
                        onFontSizeChange={updateSlotFontSize}
                      />
                    ));
                  })}
                  
                  {/* Empty slots untuk positioning mode */}
                  {isPositioningMode && getCurrentPageStudents().length < STUDENTS_PER_PAGE && (
                    Array.from({ length: STUDENTS_PER_PAGE - getCurrentPageStudents().length }).map((_, emptyIndex) => {
                      const studentIndex = getCurrentPageStudents().length + emptyIndex;
                      const baseSlotIndex = studentIndex * 6;
                      const emptySlots = templateSlots.slice(baseSlotIndex, baseSlotIndex + 6);
                      
                      return emptySlots.map((slot) => (
                        <DraggableElement
                          key={slot.id}
                          slot={slot}
                          isPositioning={isPositioningMode}
                          onPositionChange={updateSlotPosition}
                          onSizeChange={updateSlotSize}
                          onFontSizeChange={updateSlotFontSize}
                        />
                      ));
                    })
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mt-3">
                  {isPositioningMode 
                    ? "Mode Positioning: Drag elemen untuk mengatur posisi" 
                    : "Data dan foto siswa akan otomatis tertempel di posisi yang tepat"
                  }
                </p>
              </div>
            </div>
            
            {/* Student List */}
            {studentsData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={24} />
                  Daftar Siswa Terdaftar
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {studentsData.map((student, index) => (
                    <div key={student.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.photo} 
                          alt={student.name}
                          className="w-12 h-12 object-cover rounded-full border-2 border-blue-300"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.birthPlace}, {new Date(student.birthDate).toLocaleDateString('id-ID')}</p>
                          <p className="text-xs text-blue-600 font-medium">#{index + 1} • {student.submitTime}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Canvas untuk composite generation */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
};

export default YearbookSecure;