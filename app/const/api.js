/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/26/2020, 16:36
 *
 * This file is part of Bluezone (https://bluezone.ai)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// TODO Ra soat lai tinh hop ly cua cac lan retry voi tung loai API
export const TIME_RETRY_REQUEST_DEFAULT = [500, 500, 500];
export const TIME_RETRY_UPLOAD_HISTORY = [5000, 20000, 50000, 60000];
export const TIME_RETRY_AUTO_REGISTER_USER = [
  1000,
  3000,
  8000,
  13000,
  21000,
  34000,
  55000,
];
export const TIME_RETRY_REGISTER_USER = [100, 100, 100, 100, 100];
export const TIME_RETRY_UPDATE_TOKEN_FIREBASE = [
  1000,
  3000,
  8000,
  13000,
  21000,
  34000,
  55000,
];
