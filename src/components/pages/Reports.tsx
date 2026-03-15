import React from 'react';
import { FileText, ExternalLink, FileBarChart } from 'lucide-react';
import { ClubReport } from '../../types';
import { downloadAsPDF } from '../../utils/pdfGenerator';
import DownloadButton from '../DownloadButton';
import { useTheme } from '../../contexts/ThemeContext';

interface ReportsProps {
    reports: ClubReport[];
}

const Reports: React.FC<ReportsProps> = ({ reports }) => {
    const { isDark } = useTheme();

    const handleDownload = (report: ClubReport) => {
        if (report.fileUrl && report.fileUrl !== '#') {
            if (report.fileUrl.startsWith('data:application/pdf')) {
                // Convert data URI to Blob to bypass browser URL length limits
                try {
                    const base64Parts = report.fileUrl.split(',');
                    const byteString = atob(base64Parts[1]);
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    const blob = new Blob([ab], { type: 'application/pdf' });
                    const blobUrl = URL.createObjectURL(blob);
                    
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = report.title.replace(/\s+/g, '_') + '.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
                    return;
                } catch (err) {
                    console.error("Failed to parse base64 PDF for download", err);
                }
            }

            // Fallback for regular URLs or if Blob fails
            const link = document.createElement('a');
            link.href = report.fileUrl;
            link.download = report.title.replace(/\s+/g, '_') + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            downloadAsPDF(report.title, report.description, `${report.title}.pdf`);
        }
    };

    const handlePreview = (e: React.MouseEvent, report: ClubReport) => {
        e.preventDefault();

        if (!report.fileUrl || report.fileUrl === '#') {
            handleDownload(report); // Fallback if no file, generate simple PDF
            return;
        }

        // Modern browsers block opening base64 data URIs directly in new tabs for security reasons.
        // We bypass this by converting the data URI to a Blob and creating an Object URL.
        if (report.fileUrl.startsWith('data:application/pdf')) {
            try {
                const base64Parts = report.fileUrl.split(',');
                const byteString = atob(base64Parts[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                
                window.open(blobUrl, '_blank');
                
                // Cleanup the object URL after 1 minute
                setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
            } catch (err) {
                console.error("Failed to parse base64 PDF for preview", err);
                window.open(report.fileUrl, '_blank'); // fallback
            }
        } else {
            // If it's a regular url (like s3 bucket link), just open it
            window.open(report.fileUrl, '_blank');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pt-40 pb-12 animate-fade-in-up">
            <div className="text-center mb-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
                <FileBarChart className="w-16 h-16 text-purple-500 mx-auto mb-6" />
                <h2 className={`text-4xl md:text-5xl font-extrabold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Activity Reports</h2>
                <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Transparency impacts trust. Access our detailed monthly reports and event summaries.</p>
            </div>

            {/* --- Downloadable Reports Grid --- */}
            <section className="mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reports.length > 0 ? reports.map(report => (
                        <div key={report.id} className={`group border rounded-[1.5rem] overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col relative transition-all ${isDark ? 'bg-[#0A0A0C] border-white/5 hover:border-purple-500/30' : 'bg-white border-black/10 hover:border-purple-500/40 shadow-lg'}`}>
                            <a
                                href="#"
                                className="flex-1 flex flex-col"
                                onClick={(e) => handlePreview(e, report)}
                            >
                                <div className={`h-48 relative overflow-hidden border-b ${isDark ? 'bg-slate-900 border-white/5' : 'bg-slate-100 border-black/5'}`}>
                                    <img src={report.thumbnailUrl} alt={report.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                                    <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDark ? 'from-[#0A0A0C]' : 'from-white'}`}></div>
                                    <div className={`absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center ${isDark ? 'bg-black/40' : 'bg-white/40'}`}>
                                        <div
                                            className="relative group/btn border-none bg-transparent p-0 outline-none cursor-pointer font-sans font-bold uppercase text-sm"
                                        >
                                            <span
                                                className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-lg transform translate-y-1 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover/btn:translate-y-1.5 group-hover/btn:duration-[250ms] group-active/btn:translate-y-px"
                                            ></span>

                                            <span
                                                className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-[hsl(217,33%,16%)] via-[hsl(217,33%,32%)] to-[hsl(217,33%,16%)]"
                                            ></span>

                                            <div
                                                className="relative flex items-center justify-between py-2 px-5 text-sm text-white rounded-lg transform -translate-y-1 bg-gradient-to-r from-[#f27121] via-[#e94057] to-[#8a2387] gap-2 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover/btn:-translate-y-1.5 group-hover/btn:duration-[250ms] group-active/btn:-translate-y-0.5 brightness-100 group-hover/btn:brightness-110"
                                            >
                                                <span className="select-none tracking-wider">View Report</span>

                                                <svg
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className="w-4 h-4 ml-1 -mr-1 transition duration-250 group-hover/btn:translate-x-1"
                                                >
                                                    <path
                                                        clipRule="evenodd"
                                                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                        fillRule="evenodd"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h4 className={`font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.title}</h4>
                                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">{report.description}</p>
                                    </div>

                                    <div className={`mt-auto pt-4 border-t flex justify-between items-center ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{report.date}</span>
                                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                            <DownloadButton onDownload={() => handleDownload(report)} />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    )) : (
                        <div className={`col-span-full py-20 text-center border border-dashed rounded-[2rem] ${isDark ? 'text-slate-500 border-white/10 bg-white/5' : 'text-slate-600 border-black/10 bg-slate-50'}`}>
                            <FileText className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-400'}`} />
                            <p>No public reports uploaded yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Reports;

