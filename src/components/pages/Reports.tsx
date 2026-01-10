import React from 'react';
import { FileText, ExternalLink, Download, FileBarChart } from 'lucide-react';
import { ClubReport } from '../../types';
import { downloadAsPDF } from '../../utils/pdfGenerator';

interface ReportsProps {
    reports: ClubReport[];
}

const Reports: React.FC<ReportsProps> = ({ reports }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 pt-40 pb-12 animate-fade-in-up">
            <div className="text-center mb-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
                <FileBarChart className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Activity Reports</h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">Transparency impacts trust. Access our detailed monthly reports and event summaries.</p>
            </div>

            {/* --- Downloadable Reports Grid --- */}
            <section className="mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {reports.length > 0 ? reports.map(report => (
                        <div key={report.id} className="group bg-[#0F0F11] border border-white/5 rounded-[1.5rem] overflow-hidden hover:border-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col relative">

                            <div className="h-40 relative overflow-hidden bg-slate-900 border-b border-white/5">
                                <img src={report.thumbnailUrl} alt={report.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                                        <ExternalLink className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h4 className="font-bold text-white text-lg mb-2 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">{report.title}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{report.description}</p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{report.date}</span>
                                    <button
                                        onClick={() => {
                                            if (report.fileUrl !== '#') {
                                                window.open(report.fileUrl, '_blank');
                                            } else {
                                                downloadAsPDF(report.title, report.description, `${report.title}.pdf`);
                                            }
                                        }}
                                        className="text-xs font-bold flex items-center gap-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                                    >
                                        <Download className="w-3 h-3" /> PDF
                                    </button>
                                </div>
                            </div>
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
