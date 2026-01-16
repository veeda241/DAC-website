import React from 'react';
import { FileText, ExternalLink, FileBarChart } from 'lucide-react';
import { ClubReport } from '../../types';
import { downloadAsPDF } from '../../utils/pdfGenerator';
import DownloadButton from '../DownloadButton';

interface ReportsProps {
    reports: ClubReport[];
}

const Reports: React.FC<ReportsProps> = ({ reports }) => {
    const handleDownload = (report: ClubReport) => {
        if (report.fileUrl && report.fileUrl !== '#') {
            const url = report.fileUrl;

            // If it's a data URL, we might want to handle it differently for large files
            // but for now, standard link click is fine for download.
            const link = document.createElement('a');
            link.href = url;
            link.download = report.title.replace(/\s+/g, '_') + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            downloadAsPDF(report.title, report.description, `${report.title}.pdf`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pt-40 pb-12 animate-fade-in-up">
            <div className="text-center mb-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] -z-10"></div>
                <FileBarChart className="w-16 h-16 text-cyan-500 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Activity Reports</h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">Transparency impacts trust. Access our detailed monthly reports and event summaries.</p>
            </div>

            {/* --- Downloadable Reports Grid --- */}
            <section className="mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reports.length > 0 ? reports.map(report => (
                        <div key={report.id} className="group bg-[#0A0A0C] border border-white/5 rounded-[1.5rem] overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col relative">
                            <a
                                href={report.fileUrl && report.fileUrl !== '#' ? report.fileUrl : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={report.fileUrl && report.fileUrl !== '#' ? `${report.title.replace(/\s+/g, '_')}.pdf` : undefined}
                                className="flex-1 flex flex-col"
                                onClick={(e) => {
                                    if (!report.fileUrl || report.fileUrl === '#') {
                                        e.preventDefault();
                                        handleDownload(report);
                                    }
                                }}
                            >
                                <div className="h-48 relative overflow-hidden bg-slate-900 border-b border-white/5">
                                    <img src={report.thumbnailUrl} alt={report.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent"></div>
                                    <div className="absolute inset-0 bg-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                                            <ExternalLink className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h4 className="font-bold text-white text-lg mb-2 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">{report.title}</h4>
                                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">{report.description}</p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{report.date}</span>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <DownloadButton onDownload={() => handleDownload(report)} />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center text-slate-500 border border-dashed border-white/10 rounded-[2rem] bg-white/5">
                            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p>No public reports uploaded yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Reports;

