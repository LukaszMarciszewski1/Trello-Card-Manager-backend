import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Member } from './models/member.interface';
import { Board } from './models/board.interface';

@Injectable()
export class TrelloService {
  //private readonly baseUrl = 'https://api.trello.com/1';

  async getBoards(): Promise<Board[]> {
    const response = await axios.get(
      `${process.env.TRELLO_URL}/members/me/boards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
    );
    return response.data;
  }

  async getMembers(): Promise<Member[]> {
    const boards = await this.getBoards();

    const members = await Promise.all(
      boards
        .map(async (board: { id: string }) => {
          const allMembersOfBoards = await axios.get(
            `${process.env.TRELLO_URL}/boards/${board.id}/members?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
          );
          return allMembersOfBoards.data;
        }),
    ).then((res) => {
        const mergingArraysOfMembers = [].concat(...res);
        const membersIds = mergingArraysOfMembers?.map((member: Member) => member.id);
        const uniqueArrayOfMembers = mergingArraysOfMembers.filter(({ id }, index) => !membersIds.includes(id, index + 1));
        return uniqueArrayOfMembers
    });

    return members;
  }

  async findByUserName(username: string): Promise<any> {
    const members = await this.getMembers()
    return members.find((member) => member.username === username);
  }

  async validateTrelloUser(username: string): Promise<boolean> {
    const members = await this.getMembers()
    const existingTrelloMember = members.some(user => user.username === username);
    return existingTrelloMember;
  }

}

