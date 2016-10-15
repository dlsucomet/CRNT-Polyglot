import { ReactionNetwork } from '../../shared/reaction-network';


interface FileGenerator {
  name: string;
  description: string;
  fileExtension: string;
  generateFile(reactionNetwork: ReactionNetwork): string;
}
export default FileGenerator;
