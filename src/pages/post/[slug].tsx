/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Comments from '../../components/Comments';
import { Footer } from '../../components/Footer';

interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  currentPost: Post;
  nextPost: Post;
  previousPost: Post;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Post({
  currentPost,
  previousPost,
  nextPost,
}: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  function calculateReadTime(): string {
    const HUMAN_WORDS_PER_MINUTE = 200;

    const wordCount = currentPost.data.content.reduce((acc, content) => {
      const body = RichText.asText(content.body);
      const splittedBody = body.split(' ');
      acc += splittedBody.length;
      return acc;
    }, 0);

    const readTime = Math.ceil(wordCount / HUMAN_WORDS_PER_MINUTE);

    return `${readTime} min`;
  }

  function renderLastPublishDateLabel(): string {
    return `
      ${format(
        new Date(currentPost.last_publication_date),
        "'* editado em' dd 'de' MMMM', às ' HH:mm'",
        {
          locale: ptBR,
        }
      )}
    `;
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <img
          src={currentPost.data.banner.url}
          alt={currentPost.data.banner.url}
        />
        <article className={`${styles.post} ${commonStyles.defaultContainer}`}>
          <strong>{currentPost.data.title}</strong>
          <div className={styles.postDetails}>
            <div>
              <FiCalendar className={styles.icon} size={20} />
              {format(
                new Date(currentPost.first_publication_date),
                'dd MMM yyyy',
                {
                  locale: ptBR,
                }
              )}
            </div>
            <div>
              <FiUser className={styles.icon} size={20} />
              {currentPost.data.author}
            </div>
            <div>
              <FiClock className={styles.icon} size={20} />
              {calculateReadTime()}
            </div>
          </div>
          <div className={styles.lastPublishDateLabel}>
            {renderLastPublishDateLabel()}
          </div>
          {currentPost.data.content.map(content => {
            return (
              <div key={content.heading} className={styles.contentContainer}>
                <div className={styles.contentTitle}>{content.heading}</div>
                <div
                  className={styles.postContent}
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </div>
            );
          })}
        </article>
        <Footer previousPost={previousPost} nextPost={nextPost} />
        <Comments />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 5,
    }
  );

  const paths = posts.results.reduce((acc, currentResult) => {
    acc.push({
      params: {
        slug: currentResult.uid,
      },
    });

    return acc;
  }, []);

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;

  const response = await prismic.getByUID('post', String(slug), {});

  let postAfter = null;
  let postBefore = null;

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: response.data.banner,
      author: response.data.author,
      content: [...response.data.content],
    },
  };

  const postAfterResponse = await prismic.query(
    [
      Prismic.predicates.dateAfter(
        'document.first_publication_date',
        post.first_publication_date
      ),
    ],
    {
      pageSize: 1,
    }
  );

  if (postAfterResponse.results[0]) {
    postAfter = {
      uid: postAfterResponse.results[0].uid,
      data: {
        title: postAfterResponse.results[0].data.title,
      },
    };
  }

  const postBeforeResponse = await prismic.query(
    [
      Prismic.predicates.dateBefore(
        'document.first_publication_date',
        post.first_publication_date
      ),
    ],
    {
      pageSize: 1,
    }
  );

  if (postBeforeResponse.results[0]) {
    postBefore = {
      uid: postBeforeResponse.results[0].uid,
      data: {
        title: postBeforeResponse.results[0].data.title,
      },
    };
  }

  return {
    props: {
      nextPost: postAfter,
      currentPost: post,
      previousPost: postBefore,
    },
    redirect: 60 * 30, // 30 minutes
  };
};
