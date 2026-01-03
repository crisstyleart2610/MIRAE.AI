import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GlassCard, GlassButton, GlassInput, GlassSelect, GlassSlider, GlassImageUpload, GlassIdeaGenerator, GlassIcon } from './components/GlassUI';
import { checkApiKeySelection, promptApiKeySelection, generateImage, editImage, generatePromptFromImage } from './services/geminiService';
import { AspectRatio, ImageSize, TabId, CreateMode, ProductParams, Language, ViewState } from './types';

// Icons
const IconHome = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconSearch = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconHistory = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/></svg>;
const IconEditor = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;

const IconGenerate = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconUpscale = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>;
const IconDownload = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconKey = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconArrowLeft = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

// Specific Icons for Menu Categories
const IconProduct = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const IconFashion = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;
const IconPortrait = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconConcept = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><path d="M9 21h6"/></svg>;
const IconGraphic = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/><path d="m14.83 9.17-5.66 5.66"/></svg>;


// Translation Dictionary
const TRANS = {
  vi: {
    app_name: "MIRAE.",
    app_subtitle: "Dịch vụ sáng tạo hình ảnh doanh nghiệp",
    
    connect_key: "Kết nối API Key",
    key_ready: "Sẵn sàng",
    
    // Main Cards
    card_gen_title: "Generate",
    card_gen_desc: "Sáng tạo hình ảnh từ ý tưởng",
    card_upscale_title: "Upscale",
    card_upscale_desc: "Tăng độ phân giải 4K",
    card_edit_title: "Editor",
    card_edit_desc: "Chỉnh sửa chuyên sâu",

    // Gen Menu Categories
    cat_product_title: "Product",
    cat_product_desc: "Chụp ảnh sản phẩm chuyên nghiệp",
    cat_fashion_title: "Fashion",
    cat_fashion_desc: "Lookbook thời trang cao cấp",
    cat_portrait_title: "Portrait",
    cat_portrait_desc: "Chân dung doanh nhân",
    cat_concept_title: "Concept",
    cat_concept_desc: "Nghệ thuật & Ý tưởng",
    cat_graphic_title: "Graphic",
    cat_graphic_desc: "Vector & Logo",

    // UI
    back_home: "Trang chủ",
    back_menu: "Menu",
    
    ref_images: "Ảnh tham khảo",
    product_images: "Ảnh sản phẩm",
    prompt_idea: "Gợi ý",
    prompt_idea_btn: "Phân tích",
    analyzing: "...",
    
    upload_title: "Đã tải ảnh",
    upload_subtitle: "Nhấn để thay đổi",
    upload_empty: "Tải ảnh lên",
    
    lbl_resolution: "Độ phân giải",
    lbl_ratio: "Tỷ lệ khung hình",
    
    btn_create: "Tạo hình ảnh",
    btn_creating: "Đang xử lý...",
    btn_download: "Lưu ảnh",
    
    result_title: "Kết quả",
    footer: "Mirae AI Studio • Powered by Gemini Nano Banana Pro",
    
    // Product Params
    p_context_lbl: "Mô tả / Context",
    p_context_ph: "Mô tả chi tiết sản phẩm...",
    p_bg_lbl: "Nền",
    p_bg_ph: "Studio, thiên nhiên...",
    p_lighting_lbl: "Ánh sáng",
    p_lighting_ph: "Professional Studio Lighting, Soft Light, Hard Light...",
    p_pos_lbl: "Vị trí (Position)",
    p_camera_angle_lbl: "Góc máy (Angle)",
    p_scale_lbl: "Tỷ lệ",
    p_equip_lbl: "Thiết bị",
    p_equip_ph: "Sony A7IV, Lens 85mm, DSLR...",
    p_quality_lbl: "Chất lượng",
    p_quality_ph: "Very realistic, 8k, 3D render...",
    p_add_lbl: "Thêm",
    p_add_ph: "Chi tiết...",
    p_neg_lbl: "Tránh",
    p_neg_ph: "Mờ, xấu...",
    
    ph_pos: "Chọn vị trí...",
    ph_angle: "Chọn góc máy...",

    prompt_lbl: "Nhập mô tả của bạn",
    notes_lbl: "Ghi chú",
    ph_edit: "Thêm chi tiết...",
    ph_upscale: "Làm nét ảnh...",
    ph_portrait: "Chân dung...",
    ph_concept: "Ý tưởng...",
    ph_graphic: "Vector...",
    ph_general: "Mô tả...",
    ph_fashion: "Thời trang...",

    err_max_ref: "Tối đa 5 ảnh.",
    err_max_prod: "Tối đa 2 ảnh sản phẩm.",
    err_max_ref_prod_mode: "Tối đa 3 ảnh tham khảo.",
    err_key: "Lỗi chọn Key.",
    err_context: "Nhập mô tả.",
    err_prompt: "Nhập prompt.",
    err_file: "Chọn ảnh.",
    err_edit_prompt: "Nhập hướng dẫn sửa.",
    err_api_invalid: "API Key lỗi.",
    err_unknown: "Lỗi không xác định.",
    err_analyze: "Lỗi phân tích."
  },
  en: {
    app_name: "MIRAE.",
    app_subtitle: "Corporate Creative Solutions",
    
    connect_key: "Connect Key",
    key_ready: "Ready",
    
    card_gen_title: "Generate",
    card_gen_desc: "Create from ideas",
    card_upscale_title: "Upscale",
    card_upscale_desc: "Enhance to 4K",
    card_edit_title: "Editor",
    card_edit_desc: "Advanced editing",

    cat_product_title: "Product",
    cat_product_desc: "Professional product shots",
    cat_fashion_title: "Fashion",
    cat_fashion_desc: "High-end lookbook",
    cat_portrait_title: "Portrait",
    cat_portrait_desc: "Business headshots",
    cat_concept_title: "Concept",
    cat_concept_desc: "Art & Concepts",
    cat_graphic_title: "Graphic",
    cat_graphic_desc: "Vector & Logos",

    back_home: "Home",
    back_menu: "Menu",

    ref_images: "Reference",
    product_images: "Product Images",
    prompt_idea: "Idea",
    prompt_idea_btn: "Analyze",
    analyzing: "...",
    
    upload_title: "Image Loaded",
    upload_subtitle: "Click to change",
    upload_empty: "Upload Image",
    
    lbl_resolution: "Resolution",
    lbl_ratio: "Aspect Ratio",
    
    btn_create: "Generate",
    btn_creating: "Processing...",
    btn_download: "Save",
    
    result_title: "Result",
    footer: "Mirae AI Studio • Powered by Gemini Nano Banana Pro",

    // Product Params
    p_context_lbl: "Context",
    p_context_ph: "Describe product...",
    p_bg_lbl: "Background",
    p_bg_ph: "Studio...",
    p_lighting_lbl: "Lighting",
    p_lighting_ph: "Professional Studio Lighting, Soft Light, Hard Light...",
    p_pos_lbl: "Position",
    p_camera_angle_lbl: "Camera Angle",
    p_scale_lbl: "Scale",
    p_equip_lbl: "Equipment",
    p_equip_ph: "Sony A7IV, Lens 85mm, DSLR...",
    p_quality_lbl: "Quality",
    p_quality_ph: "Very realistic, 8k, 3D render...",
    p_add_lbl: "Add",
    p_add_ph: "Details...",
    p_neg_lbl: "Avoid",
    p_neg_ph: "Blur...",
    
    ph_pos: "Select position...",
    ph_angle: "Select angle...",

    prompt_lbl: "Enter prompt",
    notes_lbl: "Notes",
    ph_edit: "Edit details...",
    ph_upscale: "Enhance...",
    ph_portrait: "Portrait...",
    ph_concept: "Concept...",
    ph_graphic: "Vector...",
    ph_general: "Prompt...",
    ph_fashion: "Fashion...",

    err_max_ref: "Max 5 images.",
    err_max_prod: "Max 2 product images.",
    err_max_ref_prod_mode: "Max 3 reference images.",
    err_key: "Key Error.",
    err_context: "Enter context.",
    err_prompt: "Enter prompt.",
    err_file: "Select image.",
    err_edit_prompt: "Enter edit prompt.",
    err_api_invalid: "Invalid Key.",
    err_unknown: "Unknown Error.",
    err_analyze: "Analyze Error."
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  
  // Navigation State
  const [view, setView] = useState<ViewState>('home');
  const [activeTab, setActiveTab] = useState<TabId>('generate');
  const [createMode, setCreateMode] = useState<CreateMode>('product');
  
  const [apiKeyReady, setApiKeyReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [ideaLoading, setIdeaLoading] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Common Inputs
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  
  // Product Params
  const [productParams, setProductParams] = useState<ProductParams>({
    context: '',
    background: '',
    position: '', // Empty default (suggestion)
    cameraAngle: '', // Empty default (suggestion)
    scale: 70,
    lighting: '',
    equipment: '',
    quality: '',
    additional: '',
    negative: ''
  });

  const t = TRANS[lang];

  // Edit/Upscale Inputs
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const hasKey = await checkApiKeySelection();
        setApiKeyReady(hasKey);
      } catch (e) {
        console.error("Failed to check API key status", e);
      }
    };
    init();
  }, []);

  // Navigation Helpers
  const goHome = () => {
    setView('home');
    setResultImage(null);
    setError(null);
  };

  const goToGenerateMenu = () => {
    setActiveTab('generate');
    setView('generate_menu');
    setResultImage(null);
  };

  const enterWorkspace = (tab: TabId, mode?: CreateMode) => {
    setActiveTab(tab);
    if (mode) setCreateMode(mode);
    setReferenceImages([]); // Clear previous images
    setProductImages([]);
    setView('workspace');
    setResultImage(null);
  };

  const handleSelectKey = async () => {
    try {
      await promptApiKeySelection();
      setApiKeyReady(true);
    } catch (e) {
      console.error(e);
      setError(t.err_key);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewFile(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefImageAdd = (files: FileList) => {
    const max = createMode === 'product' ? 3 : 5;
    if (referenceImages.length + files.length > max) {
       alert(createMode === 'product' ? t.err_max_ref_prod_mode : t.err_max_ref);
       return;
    }
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setReferenceImages(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRefImageRemove = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductImageAdd = (files: FileList) => {
    if (productImages.length + files.length > 2) {
       alert(t.err_max_prod);
       return;
    }
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setProductImages(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProductImageRemove = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePromptIdea = async (imageSrc: string) => {
    setIdeaLoading(true);
    setError(null);
    try {
      if (!apiKeyReady) {
        await handleSelectKey();
      }
      const generatedText = await generatePromptFromImage(imageSrc, lang);
      
      if (createMode === 'product' || createMode === 'fashion') {
        updateProductParam('context', generatedText);
      } else {
        setPrompt(generatedText);
      }
    } catch (e: any) {
      console.error(e);
      setError(t.err_analyze);
    } finally {
      setIdeaLoading(false);
    }
  };

  const updateProductParam = (key: keyof ProductParams, value: any) => {
    setProductParams(prev => ({ ...prev, [key]: value }));
  };

  const constructProductPrompt = () => {
     let p = `Product/Fashion photography. ${productParams.context}. `;
     p += `Background: ${productParams.background}. `;
     if (productParams.position) p += `Placement: ${productParams.position}. `;
     if (productParams.cameraAngle) p += `Camera Angle: ${productParams.cameraAngle}. `;
     p += `Scale/Coverage: ${productParams.scale}%. `;
     p += `Lighting: ${productParams.lighting ? productParams.lighting : 'Professional Studio Lighting'}. `;
     p += `Equipment: ${productParams.equipment ? productParams.equipment : 'High-end DSLR'}. `;
     p += `Quality: ${productParams.quality ? productParams.quality : 'Very realistic, 8k'}. `;
     if (productParams.additional) p += `Additional details: ${productParams.additional}. `;
     if (productParams.negative) p += `Negative prompt: ${productParams.negative}`;
     return p;
  };

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      if (!apiKeyReady) {
        await handleSelectKey();
      }

      if (activeTab === 'generate') {
        let finalPrompt = '';
        const combinedImages = [...productImages, ...referenceImages];
        
        // Use detailed form for Product and Fashion
        if (createMode === 'product' || createMode === 'fashion') {
           if (!productParams.context) throw new Error(t.err_context);
           finalPrompt = constructProductPrompt();
        } else {
           if (!prompt) throw new Error(t.err_prompt);
           finalPrompt = createMode === 'portrait' ? `Portrait of ${prompt}, professional photography, detailed` : 
                         prompt;
        }

        const img = await generateImage({
          prompt: finalPrompt,
          aspectRatio,
          imageSize,
          referenceImages: combinedImages.length > 0 ? combinedImages : undefined
        });
        setResultImage(img);

      } else if (activeTab === 'edit' || activeTab === 'upscale') {
        if (!previewFile) {
          throw new Error(t.err_file);
        }
        
        let finalPrompt = prompt;
        let finalSize = imageSize;

        if (activeTab === 'upscale') {
           if (!finalPrompt) {
             finalPrompt = "Enhance details, high quality, 4k resolution, sharp focus, photorealistic";
           }
           if (imageSize === '1K') {
             finalSize = '4K'; 
           } else {
             finalSize = imageSize;
           }
        } else {
           if (!finalPrompt) {
             throw new Error(t.err_edit_prompt);
           }
        }

        const img = await editImage({
          imageBase64: previewFile,
          prompt: finalPrompt,
          aspectRatio,
          imageSize: finalSize
        });
        setResultImage(img);
      }

    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
         setApiKeyReady(false);
         setError(t.err_api_invalid);
      } else {
        setError(err.message || t.err_unknown);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `mirae-studio-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Placeholders
  const getPromptPlaceholder = () => {
    if (activeTab !== 'generate') {
      if (activeTab === 'edit') return t.ph_edit;
      return t.ph_upscale;
    }
    switch (createMode) {
      case 'portrait': return t.ph_portrait;
      case 'concept': return t.ph_concept;
      case 'graphic': return t.ph_graphic;
      case 'fashion': return t.ph_fashion;
      default: return t.ph_general;
    }
  };

  const renderProductForm = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
         <div className="md:col-span-2">
            <GlassInput 
              multiline
              label={t.p_context_lbl}
              placeholder={t.p_context_ph}
              value={productParams.context}
              onChange={(e) => updateProductParam('context', e.target.value)}
            />
         </div>
         
         <GlassInput 
           label={t.p_bg_lbl}
           placeholder={t.p_bg_ph}
           value={productParams.background}
           onChange={(e) => updateProductParam('background', e.target.value)}
         />

         <GlassInput 
           label={t.p_lighting_lbl}
           placeholder={t.p_lighting_ph}
           value={productParams.lighting}
           onChange={(e) => updateProductParam('lighting', e.target.value)}
         />

         {/* Camera Angle & Position & Scale - Grouped in one row with 3 columns */}
         <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
             <div className="flex-1">
               <GlassInput 
                  label={t.p_camera_angle_lbl}
                  placeholder={t.ph_angle}
                  value={productParams.cameraAngle}
                  onChange={(e) => updateProductParam('cameraAngle', e.target.value)}
                  suggestions={[
                    'Front View',
                    'Side View',
                    'Top View',
                    'Flat Lay',
                    '45 Degree',
                    'Eye Level',
                    'Low Angle',
                    'High Angle',
                    'Macro'
                  ]}
               />
             </div>
             <div className="flex-1">
               <GlassInput 
                  label={t.p_pos_lbl}
                  placeholder={t.ph_pos}
                  value={productParams.position}
                  onChange={(e) => updateProductParam('position', e.target.value)}
                  suggestions={[
                    'Center',
                    'Rule of Thirds - Left',
                    'Rule of Thirds - Right',
                    'Bottom Center',
                    'Floating',
                    'On Table'
                  ]}
               />
             </div>
             <div className="flex-1 pt-6">
                <GlassSlider 
                    label={t.p_scale_lbl}
                    min={10}
                    max={100}
                    step={10}
                    value={productParams.scale}
                    onChange={(e) => updateProductParam('scale', parseInt(e.target.value))}
                    suffix="%"
                />
             </div>
         </div>

         <GlassInput 
           label={t.p_equip_lbl}
           placeholder={t.p_equip_ph}
           value={productParams.equipment}
           onChange={(e) => updateProductParam('equipment', e.target.value)}
         />

         <GlassInput 
           label={t.p_quality_lbl}
           placeholder={t.p_quality_ph}
           value={productParams.quality}
           onChange={(e) => updateProductParam('quality', e.target.value)}
         />

         <div className="md:col-span-2">
           <GlassInput 
             label={t.p_add_lbl}
             placeholder={t.p_add_ph}
             value={productParams.additional}
             onChange={(e) => updateProductParam('additional', e.target.value)}
           />
         </div>
         
         <div className="md:col-span-2">
           <GlassInput 
             label={t.p_neg_lbl}
             placeholder={t.p_neg_ph}
             value={productParams.negative}
             onChange={(e) => updateProductParam('negative', e.target.value)}
             className="!bg-red-500/10 !border-red-400 text-red-800"
           />
         </div>
      </div>
    );
  };

  // --- RENDER VIEWS ---

  // 1. HOME VIEW
  const renderHome = () => (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Hero Banner / Slider - Clean Glass, No Gradient */}
      <div className="w-full h-64 md:h-80 rounded-[40px] bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
        
        {/* Subtle Shine/Reflection */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Main Title - Color Gradient matches reference (Pink -> Purple -> Blue) */}
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter mb-2 font-display drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-[#F4A4C6] via-[#A78BFA] to-[#60A5FA]">
            {t.app_name}
          </h1>
          
          {/* Subtitle - Small text, wide tracking to match width */}
          <div className="w-full flex justify-center">
             <p className="text-indigo-900/60 text-xs md:text-sm font-bold uppercase tracking-[0.35em] whitespace-nowrap">
               {t.app_subtitle}
             </p>
          </div>
        </div>
      </div>

      {/* Main Options Grid - Clean Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Generate Card */}
        <button onClick={goToGenerateMenu} className="group text-left transition-all hover:-translate-y-2 duration-300">
           <GlassCard className="h-full hover:bg-white/30 transition-colors">
             <div className="mb-6">
                <GlassIcon icon={<IconGenerate />} />
             </div>
             <h3 className="text-2xl font-bold text-indigo-950 mb-2">{t.card_gen_title}</h3>
             <p className="text-slate-600 leading-relaxed font-medium">{t.card_gen_desc}</p>
           </GlassCard>
        </button>

        {/* Upscale Card */}
        <button onClick={() => enterWorkspace('upscale')} className="group text-left transition-all hover:-translate-y-2 duration-300">
           <GlassCard className="h-full hover:bg-white/30 transition-colors">
             <div className="mb-6">
                <GlassIcon icon={<IconUpscale />} />
             </div>
             <h3 className="text-2xl font-bold text-indigo-950 mb-2">{t.card_upscale_title}</h3>
             <p className="text-slate-600 leading-relaxed font-medium">{t.card_upscale_desc}</p>
           </GlassCard>
        </button>

        {/* Editor Card */}
        <button onClick={() => enterWorkspace('edit')} className="group text-left transition-all hover:-translate-y-2 duration-300">
           <GlassCard className="h-full hover:bg-white/30 transition-colors">
             <div className="mb-6">
                <GlassIcon icon={<IconEditor />} />
             </div>
             <h3 className="text-2xl font-bold text-indigo-950 mb-2">{t.card_edit_title}</h3>
             <p className="text-slate-600 leading-relaxed font-medium">{t.card_edit_desc}</p>
           </GlassCard>
        </button>
      </div>
    </div>
  );

  // 2. GENERATE MENU VIEW
  const renderGenerateMenu = () => {
    // Clean categories
    const categories = [
      { id: 'product', title: t.cat_product_title, desc: t.cat_product_desc, icon: <IconProduct /> },
      { id: 'fashion', title: t.cat_fashion_title, desc: t.cat_fashion_desc, icon: <IconFashion /> },
      { id: 'portrait', title: t.cat_portrait_title, desc: t.cat_portrait_desc, icon: <IconPortrait /> },
      { id: 'concept', title: t.cat_concept_title, desc: t.cat_concept_desc, icon: <IconConcept /> },
      { id: 'graphic', title: t.cat_graphic_title, desc: t.cat_graphic_desc, icon: <IconGraphic /> },
    ];

    return (
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-in slide-in-from-right-10 duration-500">
         <div className="flex items-center gap-4">
            <button onClick={goHome} className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-slate-700 transition-colors shadow-sm backdrop-blur-md">
               <IconArrowLeft />
            </button>
            <div>
               <h2 className="text-3xl font-bold text-indigo-950">{t.card_gen_title}</h2>
               <p className="text-indigo-900/60 font-medium">{t.app_subtitle}</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
               <button 
                  key={cat.id} 
                  onClick={() => enterWorkspace('generate', cat.id as CreateMode)}
                  className="group text-left"
               >
                  <GlassCard className="h-full hover:bg-white/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                     <div className="mb-4">
                        <GlassIcon icon={cat.icon} size="sm" />
                     </div>
                     <h3 className="text-xl font-bold text-indigo-950 mb-1">{cat.title}</h3>
                     <p className="text-sm text-slate-600 font-medium">{cat.desc}</p>
                  </GlassCard>
               </button>
            ))}
         </div>
      </div>
    );
  };

  // 3. WORKSPACE VIEW (The Form)
  const renderWorkspace = () => {
    return (
      <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
         {/* Navigation Breadcrumb */}
         <div className="flex items-center gap-2 mb-6 text-sm text-indigo-900/70 font-medium">
            <button onClick={goHome} className="hover:text-slate-900 transition-colors bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">{t.back_home}</button>
            <span className="text-slate-400">/</span>
            {activeTab === 'generate' && (
              <>
                <button onClick={goToGenerateMenu} className="hover:text-slate-900 transition-colors bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">{t.back_menu}</button>
                <span className="text-slate-400">/</span>
                <span className="text-slate-800 font-bold capitalize bg-white/40 px-3 py-1 rounded-full shadow-sm">{createMode}</span>
              </>
            )}
            {activeTab !== 'generate' && (
               <span className="text-slate-800 font-bold capitalize bg-white/40 px-3 py-1 rounded-full shadow-sm">
                  {activeTab === 'edit' ? t.card_edit_title : t.card_upscale_title}
               </span>
            )}
         </div>

         <GlassCard className="!p-0 overflow-hidden shadow-2xl">
            {/* Card Content Body */}
            <div className="p-8">
              <div className="flex flex-col gap-6">

                {/* Common: Reference Images & Prompt Idea (Only in Generate) */}
                {activeTab === 'generate' && (
                  <div className="flex flex-col md:flex-row gap-4 mb-2">
                     {/* Dynamic Image Upload Sections */}
                    <div className="flex-1 flex flex-col md:flex-row gap-4">
                        {createMode === 'product' && (
                            <div className="flex-1">
                                <GlassImageUpload 
                                    images={productImages} 
                                    onAdd={handleProductImageAdd} 
                                    onRemove={handleProductImageRemove}
                                    label={t.product_images}
                                    maxImages={2}
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <GlassImageUpload 
                                images={referenceImages} 
                                onAdd={handleRefImageAdd} 
                                onRemove={handleRefImageRemove}
                                label={t.ref_images}
                                maxImages={createMode === 'product' ? 3 : 5}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-48 flex-shrink-0">
                      <GlassIdeaGenerator 
                        onPromptGenerated={handlePromptIdea}
                        isLoading={ideaLoading}
                        label={t.prompt_idea}
                        loadingLabel={t.analyzing}
                        buttonLabel={t.prompt_idea_btn}
                      />
                    </div>
                  </div>
                )}

                {/* File Upload for Edit/Upscale */}
                {(activeTab === 'edit' || activeTab === 'upscale') && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/40 rounded-2xl p-8 hover:bg-white/10 transition-colors cursor-pointer group bg-white/5"
                  >
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       onChange={handleFileChange} 
                       className="hidden" 
                       accept="image/*"
                     />
                     {previewFile ? (
                       <div className="flex items-center gap-6">
                         <img src={previewFile} alt="Preview" className="w-32 h-32 object-cover rounded-xl shadow-md" />
                         <div>
                            <h3 className="font-semibold text-slate-800">{t.upload_title}</h3>
                            <p className="text-sm text-slate-500">{t.upload_subtitle}</p>
                         </div>
                       </div>
                     ) : (
                       <div className="flex flex-col items-center text-slate-500 group-hover:text-slate-700">
                         <div className="w-16 h-16 mb-3 opacity-60">
                           <GlassIcon icon={<IconGenerate />} />
                         </div>
                         <span className="font-medium">{t.upload_empty}</span>
                       </div>
                     )}
                  </div>
                )}

                {/* Prompt & Inputs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                   
                   {/* Main Prompt Area */}
                   <div className="lg:col-span-12">
                      {activeTab === 'generate' && (createMode === 'product' || createMode === 'fashion') ? (
                        renderProductForm()
                      ) : (
                        <GlassInput 
                          multiline={false}
                          label={activeTab === 'upscale' ? t.notes_lbl : t.prompt_lbl}
                          value={prompt} 
                          onChange={(e) => setPrompt(e.target.value)} 
                          placeholder={getPromptPlaceholder()}
                        />
                      )}
                   </div>

                   {/* Resolution */}
                   <div className="lg:col-span-5">
                      <GlassSelect 
                        label={t.lbl_resolution}
                        value={imageSize} 
                        onChange={(e) => setImageSize(e.target.value as ImageSize)}
                        options={[
                          { value: '1K', label: '1K Standard' },
                          { value: '2K', label: '2K Pro' },
                          { value: '4K', label: '4K Ultra' },
                        ]}
                      />
                   </div>

                   {/* Ratio */}
                   <div className="lg:col-span-5">
                      <GlassSelect 
                        label={t.lbl_ratio}
                        value={aspectRatio} 
                        onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                        options={[
                          { value: '1:1', label: '1:1 Square' },
                          { value: '16:9', label: '16:9 Wide' },
                          { value: '9:16', label: '9:16 Tall' },
                          { value: '3:4', label: '3:4 Portrait' },
                          { value: '4:3', label: '4:3 Landscape' },
                          { value: '21:9', label: '21:9 Cinematic' },
                          { value: '9:21', label: '9:21 Vertical Cinema' },
                          { value: '3:2', label: '3:2 Classic' },
                          { value: '2:3', label: '2:3 Vertical Classic' },
                        ]}
                      />
                   </div>

                   {/* Submit Button */}
                   <div className="lg:col-span-2">
                      <GlassButton 
                        onClick={handleAction} 
                        disabled={loading} 
                        className="w-full h-[58px]"
                        variant="primary"
                      >
                        {loading ? t.btn_creating : t.btn_create}
                      </GlassButton>
                   </div>
                </div>

                {error && (
                  <p className="text-red-600 text-sm bg-red-100/50 px-4 py-2 rounded-lg border border-red-200 font-medium">
                    {error}
                  </p>
                )}

              </div>
            </div>
          </GlassCard>

          {/* Results Area */}
          {resultImage && (
            <div className="w-full mt-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <GlassCard className="relative overflow-hidden group bg-white/30">
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-slate-800">{t.result_title}</h2>
                   <div className="flex gap-2">
                     <GlassButton onClick={downloadImage} variant="secondary" className="!py-2 !px-4 text-sm">
                       <IconDownload /> {t.btn_download}
                     </GlassButton>
                   </div>
                 </div>
                 
                 <div className="flex justify-center bg-white/20 rounded-2xl p-4 border border-white/30">
                    <img 
                      src={resultImage} 
                      alt="Generated Result" 
                      className="max-h-[80vh] object-contain rounded-lg shadow-sm"
                    />
                 </div>
              </GlassCard>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center z-50 sticky top-0 bg-white/5 backdrop-blur-md border-b border-white/10">
        
        {/* Left: Language & Shortcuts */}
        <div className="flex items-center gap-4">
           {/* Language Switch */}
           <div className="flex bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-sm overflow-hidden p-1">
             <button 
               onClick={() => setLang('en')} 
               className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:text-slate-800'}`}
             >
               ENG
             </button>
             <button 
               onClick={() => setLang('vi')} 
               className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'vi' ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:text-slate-800'}`}
             >
               VIE
             </button>
          </div>

          {/* Shortcuts */}
          <div className="hidden md:flex gap-2">
            <button onClick={goHome} className="p-2 rounded-full hover:bg-white/20 text-slate-700 transition-colors" title="Home">
               <IconHome />
            </button>
            <button className="p-2 rounded-full hover:bg-white/20 text-slate-700 transition-colors" title="Search">
               <IconSearch />
            </button>
            <button className="p-2 rounded-full hover:bg-white/20 text-slate-700 transition-colors" title="History">
               <IconHistory />
            </button>
            <button onClick={() => enterWorkspace('edit')} className="p-2 rounded-full hover:bg-white/20 text-slate-700 transition-colors" title="Photo Editor">
               <IconEditor />
            </button>
          </div>
        </div>

        {/* Center: Branding (Visible on mobile/menu) */}
        {view !== 'home' && (
           <div className="absolute left-1/2 -translate-x-1/2 font-bold text-slate-800 tracking-tight hidden md:block">
              {t.app_name}
           </div>
        )}

        {/* Right: API Key */}
        <div className="flex items-center gap-4">
          <button 
             onClick={handleSelectKey}
             className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${apiKeyReady ? 'bg-emerald-400/20 text-emerald-800 border border-emerald-400/40 shadow-sm' : 'bg-slate-900 text-white shadow-lg shadow-slate-500/20'}`}
          >
             <IconKey />
             {apiKeyReady ? t.key_ready : t.connect_key}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start pt-10 px-4 pb-20 w-full z-10">
        {view === 'home' && renderHome()}
        {view === 'generate_menu' && renderGenerateMenu()}
        {view === 'workspace' && renderWorkspace()}
      </main>

      <footer className="w-full py-6 text-center text-slate-500/80 text-sm font-medium z-10">
        {t.footer}
      </footer>
    </div>
  );
};

// Render logic
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;