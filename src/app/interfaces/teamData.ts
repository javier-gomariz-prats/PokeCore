export interface TeamData {
  Comments: string;
  TEAM: string;
  TeamName: string;
  set: {
    ability: string;
    evs: {
      atk: number;
      def: number;
      hp: number;
      spa: number;
      spd: number;
      spe: number;
    };
    gender: string;
    item: string;
    level: number;
    moves: string[];
    name: string;
    nature: string;
    species: string;
    teraType: string;
  };
  uid: string;
  [key: string]: any;
}
