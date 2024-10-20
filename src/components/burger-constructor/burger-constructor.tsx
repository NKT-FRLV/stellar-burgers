import { TIngredient, TOrder } from '@utils-types';
import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  orderBurger,
  clearConstructor,
  resetModalData
} from '../../services/constructorSlice';
import { RootState } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const user = useSelector((state: RootState) => state.userData.user);

  //  тут будем получать данные из слайса Конструктора
  const { constructorItems, orderModalData, orderRequest } = useSelector(
    (state) => state.constructorBurger
  );

  const bunID = constructorItems.bun?._id as string;
  const ingredientsID: string[] = constructorItems.ingredients.map(
    (i) => i._id
  );

  let stringIdArray: string[] = [bunID, ...ingredientsID, bunID];

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (user) {
      dispatch(orderBurger(stringIdArray));
    } else {
      navigate('/login', { state: { from: '/' } });
    }

    // navigate(`/feed/${orderModalData?.number}`); //СОМНИТЕЛЬНО!!!!
  };

  //СОМНИТЕЛЬНО!!!!
  const closeOrderModal = () => {
    // navigate('/');
    dispatch(resetModalData());
  }; //СОМНИТЕЛЬНО!!!!

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
