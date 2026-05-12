"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ✨ แนะนำให้แยกเป็น Component ย่อยไว้ในโฟลเดอร์ components ของคุณ
const ArticleCard = ({ article, onClick }: { article: any, onClick: (id: string) => void }) => (
  <div 
    onClick={() => onClick(article.id)}
    style={cardStyle}
  >
    <div style={imageWrapper}>
      <img src={article.cover_url || "/placeholder-article.jpg"} style={coverImg} alt={article.title} />
    </div>
    <div style={cardBody}>
      <h3 style={articleTitle}>{article.title}</h3>
      <p style={articleSummary}>{article.summary}</p>
      <div style={cardFooter}>
        <span style={dateText}>{new Date(article.created_at).toLocaleDateString('th-TH')}</span>
        <span style={readMoreBtn}>อ่านต่อ →</span>
      </div>
    </div>
  </div>
);

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // ✨ ดึงข้อมูลจากตาราง articles ที่จะสร้างขึ้น
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error) setArticles(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <div style={loadingStyle}>กำลังโหลดบทความ... 🐾</div>;

  return (
    <main style={mainLayout}>
      <header style={headerStyle}>
        <button onClick={() => router.back()} style={backBtn}>←</button>
        <h1 style={titleStyle}>บทความน่ารู้</h1>
      </header>

      <section style={listContainer}>
        {articles.length > 0 ? (
          articles.map(art => (
            <ArticleCard 
              key={art.id} 
              article={art} 
              onClick={(id) => router.push(`/articles/${id}`)} 
            />
          ))
        ) : (
          <div style={emptyState}>ขณะนี้ยังไม่มีบทความใหม่ ติดตามได้เร็วๆ นี้ครับ</div>
        )}
      </section>
    </main>
  );
}

// --- 🎨 Styles ---
const FONT_VAR = 'var(--font-noto-looped)';

const mainLayout: React.CSSProperties = { display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#F5F0E6', padding: '24px 20px 80px 20px', fontFamily: FONT_VAR };
const headerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '32px' };
const titleStyle: React.CSSProperties = { fontSize: '24px', fontWeight: 400, margin: 0 };
const backBtn: React.CSSProperties = { background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', padding: 0 };

const listContainer: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '20px' };

const cardStyle: React.CSSProperties = { background: '#FFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer' };
const imageWrapper: React.CSSProperties = { width: '100%', height: '160px', background: '#EEE' };
const coverImg: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const cardBody: React.CSSProperties = { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' };
const articleTitle: React.CSSProperties = { fontSize: '18px', fontWeight: 400, margin: 0, color: '#333' };
const articleSummary: React.CSSProperties = { fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' };

const cardFooter: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' };
const dateText: React.CSSProperties = { fontSize: '11px', color: '#AAA' };
const readMoreBtn: React.CSSProperties = { fontSize: '13px', color: '#5180CE', fontWeight: 400 };

const emptyState: React.CSSProperties = { textAlign: 'center', color: '#8F8362', marginTop: '60px', fontSize: '14px' };
const loadingStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', color: '#8F8362', fontFamily: FONT_VAR };