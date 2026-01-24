import UploadForm from '@/components/upload/UploadForm';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-white font-zalando">
     

      <main className="container mx-auto px-4 py-18">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Analyze Your Job Fit</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Provide your details below and our AI will evaluate how well your profile matches the role.
          </p>
        </div>

        <UploadForm />
      </main>

     
    </div>
  );
}