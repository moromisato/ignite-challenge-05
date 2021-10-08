/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useUtterances } from '../../hooks/useUtterances';

const commentNodeId = 'comments';

const Comments = () => {
  useUtterances(commentNodeId);
  return <div id={commentNodeId} />;
};

export default Comments;
