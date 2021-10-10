/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { useState } from 'react';
import useUpdatePreviewRef from '../hooks/useUpdatePreviewRef';
import Header from '../components/Header';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Home({ postsPagination, preview }: HomeProps) {
  useUpdatePreviewRef(preview, postsPagination.results);
  const [posts, setPosts] = useState(postsPagination);

  function handleLoadMore(): void {
    fetch(postsPagination.next_page)
      .then(response => response.json())
      .then(data => {
        setPosts(prev => {
          return {
            next_page: data.next_page,
            results: [...prev.results, ...data.results],
          };
        });
      });
  }

  return (
    <>
      <Header />
      <main className={`${commonStyles.defaultContainer}`}>
        <div className={`${styles.posts} ${commonStyles.defaultContainer}`}>
          {posts.results.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <strong className={styles.title}>{post.data.title}</strong>
                <div className={styles.subtitle}>{post.data.subtitle}</div>
                <div className={styles.iconsContainer}>
                  <div>
                    <FiCalendar className={styles.icon} size={20} />
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </div>
                  <div>
                    <FiUser className={styles.icon} size={20} />
                    {post.data.author}
                  </div>
                </div>
              </a>
            </Link>
          ))}
          {posts.next_page && (
            <button
              type="button"
              onClick={handleLoadMore}
              className={styles.loadMoreButton}
            >
              <a>Carregar mais posts</a>
            </button>
          )}
          {preview && (
            <aside>
              <Link href="/api/exit-preview">
                <a>Sair do modo Preview</a>
              </Link>
            </aside>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 20,
      ref: previewData?.ref ?? null,
    }
  );

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
        preview,
      },
    },
  };
};
