import React, { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import domtoimage from 'dom-to-image';

const TEMPLATES = {
  CLASSIC: {
    name: "Classic",
    background: "#f8f4e6",
    borderColor: "#8B4513",
    accentColor: "#B8860B"
  },
  MODERN: {
    name: "Modern",
    background: "#ffffff",
    borderColor: "#2c3e50",
    accentColor: "#3498db"
  },
  ELEGANT: {
    name: "Elegant",
    background: "#fffaf0",
    borderColor: "#d4af37",
    accentColor: "#a67c00"
  }
};

const CertificateGenerator = () => {
  const [name, setName] = useState('');
  const [event, setEvent] = useState('');
  const [date, setDate] = useState('');
  const [signature, setSignature] = useState('');
  const [logo, setLogo] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES.CLASSIC);
  const [watermark, setWatermark] = useState('');
  const [additionalFields, setAdditionalFields] = useState({
    hoursCompleted: '',
    instructorName: '',
    credentialNumber: ''
  });
  
  const [certificateId, setCertificateId] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef(null);

  const generateCertificateNumber = () => {
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `CERT-${datePart}-${randomPart}`;
  };

  useEffect(() => {
    setCertificateId(generateCertificateNumber());
  }, []);

  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const downloadCertificateAsImage = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    try {
      // Use dom-to-image to convert the certificate div to an image
      const dataUrl = await domtoimage.toPng(certificateRef.current, {
        quality: 0.95,
        width: certificateRef.current.clientWidth * 2,
        height: certificateRef.current.clientHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
          width: `${certificateRef.current.clientWidth}px`,
          height: `${certificateRef.current.clientHeight}px`,
        }
      });
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `${name.replace(/\s+/g, '_')}_certificate.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error generating certificate image:", error);
      alert("Failed to download certificate as image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Professional Certificate Generator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-3">Certificate Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name*</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event/Program Name*</label>
                <input
                  type="text"
                  placeholder="Enter event name"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date*</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Authorized Signature</label>
                <input
                  type="text"
                  placeholder="Enter signer's name"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-3">Additional Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                  <input
                    type="number"
                    placeholder="e.g., 40"
                    value={additionalFields.hoursCompleted}
                    onChange={(e) => setAdditionalFields({
                      ...additionalFields,
                      hoursCompleted: e.target.value
                    })}
                    className="p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                  <input
                    type="text"
                    placeholder="Instructor name"
                    value={additionalFields.instructorName}
                    onChange={(e) => setAdditionalFields({
                      ...additionalFields,
                      instructorName: e.target.value
                    })}
                    className="p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credential Number</label>
                <input
                  type="text"
                  placeholder="Optional credential #"
                  value={additionalFields.credentialNumber}
                  onChange={(e) => setAdditionalFields({
                    ...additionalFields,
                    credentialNumber: e.target.value
                  })}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Watermark Text</label>
                <input
                  type="text"
                  placeholder="e.g., SAMPLE"
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-3">Design Options</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Object.values(TEMPLATES).map((template) => (
                <button
                  key={template.name}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-2 border rounded-md ${selectedTemplate.name === template.name ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: template.background }}
                >
                  {template.name}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                <input
                  type="color"
                  value={selectedTemplate.accentColor}
                  onChange={(e) => {
                    setSelectedTemplate({
                      ...selectedTemplate,
                      accentColor: e.target.value
                    });
                  }}
                  className="w-full h-10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            {/* Certificate Preview - added ref here */}
            <div 
              ref={certificateRef}
              className="w-full h-[210mm] border-8 p-10 text-center shadow-xl relative bg-white"
              style={{ 
                backgroundColor: selectedTemplate.background,
                borderColor: selectedTemplate.borderColor,
                aspectRatio: '297/210'
              }}
            >
              {/* Preview content */}
              <div className="absolute inset-4 border-2" style={{ borderColor: selectedTemplate.accentColor }}></div>
              <p className="text-xs text-gray-500 absolute top-5 left-5">
                Certificate ID: {certificateId}
              </p>
              {logo && (
                <div className="absolute top-6 right-6 max-w-[120px] max-h-[80px]">
                  <img src={logo} alt="Organization Logo" className="max-h-full max-w-full" />
                </div>
              )}
              {watermark && (
  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
    <p className="text-6xl font-bold transform -rotate-45 origin-center">{watermark}</p>
  </div>
)}
              <div className="mb-8 pt-8">
                <div className="text-5xl font-bold mb-2" style={{ color: selectedTemplate.accentColor }}>
                  CERTIFICATE
                </div>
                <div className="text-lg text-gray-600">OF ACHIEVEMENT</div>
              </div>
              <div className="my-10">
                <p className="text-gray-600 text-lg mb-6">This is to certify that</p>
                <div 
                  className="border-b-2 w-3/4 mx-auto mb-6"
                  style={{ borderColor: selectedTemplate.accentColor }}
                ></div>
                <p className="text-3xl font-bold text-gray-800 mb-10">{name || 'Recipient Name'}</p>
                {additionalFields.hoursCompleted && (
                  <p className="text-gray-600 mb-2">
                    Has successfully completed {additionalFields.hoursCompleted} hours of
                  </p>
                )}
                <p className="text-xl font-semibold text-gray-700 mb-2">{event || 'Event/Program Name'}</p>
                {additionalFields.instructorName && (
                  <p className="text-gray-600 mb-4">
                    Under the guidance of {additionalFields.instructorName}
                  </p>
                )}
                <p className="text-gray-600">on {date ? new Date(date).toLocaleDateString() : 'Completion Date'}</p>
                {additionalFields.credentialNumber && (
                  <p className="text-sm text-gray-500 mt-4">
                    Credential ID: {additionalFields.credentialNumber}
                  </p>
                )}
              </div>
              <div className="flex justify-between mt-16 px-10">
                <div className="w-1/3 text-center">
                  <div 
                    className="border-t-2 border-gray-400 w-3/4 mx-auto mb-2"
                    style={{ borderColor: selectedTemplate.accentColor }}
                  ></div>
                  <p className="text-sm text-gray-600">Authorized Signature</p>
                  <p className="text-sm font-medium">{signature || 'Organization Representative'}</p>
                </div>
                <div className="w-1/3 text-center">
                  <div 
                    className="border-t-2 border-gray-400 w-3/4 mx-auto mb-2"
                    style={{ borderColor: selectedTemplate.accentColor }}
                  ></div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-sm font-medium">{date ? new Date(date).toLocaleDateString() : 'Date'}</p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <QRCodeSVG 
                  value={`https://yourdomain.com/verify?cert=${certificateId}`}
                  size={80}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div 
                className="absolute bottom-10 right-10 w-20 h-20 rounded-full border-2 flex items-center justify-center text-xs"
                style={{ borderColor: selectedTemplate.accentColor, color: selectedTemplate.accentColor }}
              >
                OFFICIAL SEAL
              </div>
            </div>
            
            {/* Download Button */}
            <div className="mt-6">
              <button
                onClick={downloadCertificateAsImage}
                disabled={!name || !event || !date || isDownloading}
                className={`px-6 py-3 rounded-md transition-colors ${
                  !name || !event || !date 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : isDownloading
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isDownloading 
                  ? 'Generating image...' 
                  : (!name || !event || !date) 
                    ? 'Please fill required fields' 
                    : 'Download Certificate as Image'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;