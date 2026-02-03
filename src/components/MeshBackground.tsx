"use client";

export default function MeshBackground() {
    return (
        <div className="mesh-gradient-bg" aria-hidden="true">
            {/* Additional floating orbs for depth */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                    top: '10%',
                    left: '60%',
                    animation: 'float1 20s ease-in-out infinite',
                }}
            />
            <div
                className="absolute w-[400px] h-[400px] rounded-full opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                    bottom: '20%',
                    left: '20%',
                    animation: 'float2 25s ease-in-out infinite',
                }}
            />
            <div
                className="absolute w-[300px] h-[300px] rounded-full opacity-10"
                style={{
                    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
                    top: '60%',
                    right: '10%',
                    animation: 'float3 18s ease-in-out infinite',
                }}
            />

            <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 20px) scale(1.05); }
          66% { transform: translate(20px, -30px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 40px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -30px) scale(1.15); }
        }
      `}</style>
        </div>
    );
}
