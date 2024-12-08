import { TableRow, TableCell, Progress, AvatarGroup, Avatar } from "@nextui-org/react";

interface ProjectRowProps {
  name: string;
  members: string[];
  budget: string;
  completion: number;
}

export const ProjectRow = ({ name, members, budget, completion }: ProjectRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <span>{name}</span>
        </div>
      </TableCell>
      <TableCell>
        <AvatarGroup max={4}>
          {members.map((src, idx) => (
            <Avatar key={idx} src={src} size="sm" />
          ))}
        </AvatarGroup>
      </TableCell>
      <TableCell>{budget}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{completion}%</span>
          <Progress value={completion} className="max-w-24" color="primary" />
        </div>
      </TableCell>
    </TableRow>
  );
};
