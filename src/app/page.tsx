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

  // Update slot position (khusus admin)
  const updateSlotPosition = useCallback((slotId: number, x: number, y: number) => {
    setTemplateSlots(prev => 
      prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, x: Math.max(0, x), y: Math.max(0, y) }
          : slot
      )
    );
  }, []);

  // State untuk mutable template slots - koordinat diperbaiki berdasarkan hasil screenshot
  const [templateSlots, setTemplateSlots] = useState<DataSlot[]>([
    // Siswa 1 (paling atas)
    { id: 1, type: 'photo', x: 20, y: 65, width: 80, height: 80 },
    { id: 2, type: 'name', x: 250, y: 90, width: 250, height: 16, fontSize: 14, color: '#000', fontWeight: 'bold' },
    { id: 3, type: 'birthPlace', x: 250, y: 110, width: 150, height: 14, fontSize: 12, color: '#000' },
    { id: 4, type: 'birthDate', x: 320, y: 110, width: 100, height: 14, fontSize: 12, color: '#000' },
    { id: 5, type: 'address', x: 290, y: 130, width: 200, height: 14, fontSize: 12, color: '#000' },
    { id: 6, type: 'dream', x: 290, y: 150, width: 200, height: 14, fontSize: 12, color: '#000' },
    
    // Siswa 2
    { id: 7, type: 'photo', x: 20, y: 195, width: 80, height: 80 },
    { id: 8, type: 'name', x: 250, y: 220, width: 250, height: 16, fontSize: 14, color: '#000', fontWeight: 'bold' },
    { id: 9, type: 'birthPlace', x: 250, y: 240, width: 150, height: 14, fontSize: 12, color: '#000' },
    { id: 10, type: 'birthDate', x: 320, y: 240, width: 100, height: 14, fontSize: 12, color: '#000' },
    { id: 11, type: 'address', x: 290, y: 260, width: 200, height: 14, fontSize: 12, color: '#000' },
    { id: 12, type: 'dream', x: 290, y: 280, width: 200, height: 14, fontSize: 12, color: '#000' },
    
    // Siswa 3
    { id: 13, type: 'photo', x: 20, y: 325, width: 80, height: 80 },
    { id: 14, type: 'name', x: 250, y: 350, width: 250, height: 16, fontSize: 14, color: '#000', fontWeight: 'bold' },
    { id: 15, type: 'birthPlace', x: 250, y: 370, width: 150, height: 14, fontSize: 12, color: '#000' },
    { id: 16, type: 'birthDate', x: 320, y: 370, width: 100, height: 14, fontSize: 12, color: '#000' },
    { id: 17, type: 'address', x: 290, y: 390, width: 200, height: 14, fontSize: 12, color: '#000' },
    { id: 18, type: 'dream', x: 290, y: 410, width: 200, height: 14, fontSize: 12, color: '#000' },
    
    // Siswa 4
    { id: 19, type: 'photo', x: 20, y: 455, width: 80, height: 80 },
    { id: 20, type: 'name', x: 250, y: 480, width: 250, height: 16, fontSize: 14, color: '#000', fontWeight: 'bold' },
    { id: 21, type: 'birthPlace', x: 250, y: 500, width: 150, height: 14, fontSize: 12, color: '#000' },
    { id: 22, type: 'birthDate', x: 320, y: 500, width: 100, height: 14, fontSize: 12, color: '#000' },
    { id: 23, type: 'address', x: 290, y: 520, width: 200, height: 14, fontSize: 12, color: '#000' },
    { id: 24, type: 'dream', x: 290, y: 540, width: 200, height: 14, fontSize: 12, color: '#000' },
    
    // Siswa 5
    { id: 25, type: 'photo', x: 20, y: 585, width: 80, height: 80 },
    { id: 26, type: 'name', x: 250, y: 610, width: 250, height: 16, fontSize: 14, color: '#000', fontWeight: 'bold' },
    { id: 27, type: 'birthPlace', x: 250, y: 630, width: 150, height: 14, fontSize: 12, color: '#000' },
    { id: 28, type: 'birthDate', x: 320, y: 630, width: 100, height: 14, fontSize: 12, color: '#000' },
    { id: 29, type: 'address', x: 290, y: 650, width: 200, height: 14, fontSize: 12, color: '#000' },
    { id: 30, type: 'dream', x: 290, y: 670, width: 200, height: 14, fontSize: 12, color: '#000' },
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

  // Download composite dengan data siswa
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
            
            // Batasi panjang teks
            if (text.length > 25) {
              text = text.substring(0, 22) + '...';
            }
            
            // Set font properties
            ctx.font = `${slot.fontWeight || 'normal'} ${slot.fontSize || 12}px Arial, sans-serif`;
            ctx.fillStyle = slot.color || '#000';
            
            // Draw text
            ctx.fillText(text, slot.x, slot.y + (slot.fontSize || 12));
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
  }, [studentsData, currentPage]);

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
                <img 
                  src={TEMPLATE_IMAGE}
                  alt="Template Buku Tahunan"
                  className="max-w-full h-auto rounded-lg border-4 border-gray-300 shadow-lg"
                  style={{ maxHeight: '500px' }}
                />
                <p className="text-sm text-gray-600 mt-3">
                  Data dan foto siswa akan otomatis tertempel di posisi yang tepat
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