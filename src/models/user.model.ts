import { DataTypes } from 'sequelize';

import { sequelize } from '../settings/sequelize.settings';

const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
}) 

export default UserModel
