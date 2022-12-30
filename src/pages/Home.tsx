import React from 'react'
import { useSelector } from 'react-redux'

import { Categories, Sort, Pagination, Skeleton, PizzaBlock } from '../components'
import { useAppDispatch } from '../redux/store'
import { selectFilter } from '../redux/filter/selectors'
import { selectPizzaData } from '../redux/pizza/selectors'
import { setCategoryId, setCurrentPage } from '../redux/filter/slice'
import { fetchPizzas } from '../redux/pizza/asyncActions'

const Home: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items, status } = useSelector(selectPizzaData)
  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter)
  const onChangeCategory = React.useCallback((idx: number) => {
    dispatch(setCategoryId(idx))
  }, [])

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const getPizzas = async () => {
    const sortBy = sort.sortProperty.replace('-', '')
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
    const category = categoryId > 0 ? `category=${categoryId}` : ''
    const search = searchValue ? `&search=${searchValue}` : ''

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    )

    window.scrollTo(0, 0)
  }

  React.useEffect(() => {
    getPizzas()
  }, [categoryId, sort.sortProperty, searchValue, currentPage])

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />)
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />)

  return (
    <div className='container'>
      <div className='content__top'>
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort value={sort} />
      </div>
      <h2 className='content__title'>Все пиццы</h2>
      {status === 'error' ? (
        <div className='content__error-info'>
          <h2> Произошла ошибка :(</h2>
          <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже</p>
        </div>
      ) : (
        <div className='content__items'>{status === 'loading' ? skeletons : pizzas}</div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  )
}

export default Home
